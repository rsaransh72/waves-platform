import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { canViewSchoolArea, normalizeSchoolRole, schoolAreaForPath } from '@/lib/school-permissions'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getClaims() refreshes an expired session (writing the new cookies above) and then
  // verifies the access token's signature locally against the project's public keys,
  // instead of asking Supabase Auth on every request as getUser() did.
  const { data: claimsData } = await supabase.auth.getClaims()
  const user = claimsData?.claims?.sub ? claimsData.claims : null

  const pathname = request.nextUrl.pathname
  const isSchoolRoute = pathname === '/school' || pathname.startsWith('/school/')
  const isClientRoute = pathname === '/client' || pathname.startsWith('/client/')
  const isSchoolPublicRoute = pathname === '/school/login'
    || pathname === '/school/signup'
    || pathname === '/school/accept-invite'

  if (isSchoolRoute && !isSchoolPublicRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/school/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (isSchoolRoute && !isSchoolPublicRoute && user) {
    // One round trip: the role is null unless the user belongs to exactly one school
    // that is active or on trial (it goes through get_auth_organization_id()).
    const { data: role, error } = await supabase.rpc('get_auth_school_role')
    if (error || !role) {
      // A paused school gets its own page explaining how to restore access.
      const { data: account } = await supabase.rpc('get_my_school_account').maybeSingle<{ organization_status: string }>()
      const paused = account?.organization_status === 'suspended' || account?.organization_status === 'inactive'
      const url = request.nextUrl.clone()
      url.pathname = '/access-denied'
      url.search = paused ? '?area=school&reason=paused' : '?area=school'
      return NextResponse.redirect(url)
    }

    const area = schoolAreaForPath(pathname)
    if (area && area !== 'dashboard' && !canViewSchoolArea(normalizeSchoolRole(role), area)) {
      const url = request.nextUrl.clone()
      url.pathname = '/school'
      url.search = '?denied=1'
      return NextResponse.redirect(url)
    }
  }

  if (isClientRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (isClientRoute && user) {
    const { data: organizationId, error } = await supabase.rpc('get_auth_client_organization_id')
    if (error || !organizationId) {
      const url = request.nextUrl.clone()
      url.pathname = '/access-denied'
      url.search = '?area=client'
      return NextResponse.redirect(url)
    }
  }

  if (!user && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const { data: isAdmin, error } = await supabase.rpc('is_platform_admin')
    if (error || !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/access-denied'
      url.search = '?area=admin'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

// Only the signed-in areas need the session check. The public website is cached and
// served straight from the CDN, without running this on every visit.
export const config = {
  matcher: [
    '/school/:path*',
    '/client/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/access-denied',
  ],
}
