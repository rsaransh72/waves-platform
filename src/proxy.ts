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

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    const { data: organizationId, error } = await supabase.rpc('get_auth_organization_id')
    if (error || !organizationId) {
      const url = request.nextUrl.clone()
      url.pathname = '/access-denied'
      url.search = '?area=school'
      return NextResponse.redirect(url)
    }

    const area = schoolAreaForPath(pathname)
    if (area && area !== 'dashboard') {
      const { data: role } = await supabase.rpc('get_auth_school_role')
      if (!canViewSchoolArea(normalizeSchoolRole(role), area)) {
        const url = request.nextUrl.clone()
        url.pathname = '/school'
        url.search = '?denied=1'
        return NextResponse.redirect(url)
      }
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}