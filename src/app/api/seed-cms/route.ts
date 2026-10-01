import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const schoolErpProduct = {
  title: 'School ERP',
  slug: 'school-erp',
  subtitle: 'School management software for admissions, academics, attendance, fees, and parent communication.',
  description: 'A unified platform for school administration, teaching staff, students, and families.',
  color: 'from-blue-600 to-blue-800',
  accent_color: '#226eb4',
  category: 'Education',
  features: [
    { title: 'Student Management', desc: 'Manage admissions, student records, and class placement.', iconKey: 'users' },
    { title: 'Attendance and Academics', desc: 'Track attendance, exams, results, and academic progress.', iconKey: 'book' },
    { title: 'Fees and Parent Communication', desc: 'Coordinate fee collection and school-to-family updates.', iconKey: 'message' },
  ],
  use_cases: [
    { title: 'School Administration', desc: 'Coordinate daily operations, staff, classes, and student records.' },
    { title: 'Academic Management', desc: 'Manage attendance, exams, results, and communication with families.' },
  ],
  target_audience: ['Schools', 'School administrators', 'Teachers'],
  pricing: [],
  integrations: [],
  faqs: [],
  related_apps: [],
  status: 'published',
  visibility: 'public',
  seo_title: 'School ERP | Waves',
  seo_description: 'School management software for admissions, academics, attendance, fees, and parent communication.',
};

export async function POST() {
  const sessionClient = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ success: false, error: 'Sign in to a platform administrator account.' }, { status: 401 });
  }

  const { data: isPlatformAdmin, error: roleError } = await sessionClient.rpc('is_platform_admin');
  if (roleError || !isPlatformAdmin) {
    return NextResponse.json({ success: false, error: 'Only platform administrators can seed the product catalog.' }, { status: 403 });
  }

  try {
    const { data: product, error: upsertError } = await sessionClient
      .from('products')
      .upsert(schoolErpProduct, { onConflict: 'slug' })
      .select('id, title, slug')
      .single();

    if (upsertError) {
      return NextResponse.json({ success: false, error: upsertError.message }, { status: 500 });
    }

    const { data: removedProducts, error: deleteError } = await sessionClient
      .from('products')
      .delete()
      .neq('slug', schoolErpProduct.slug)
      .select('id');

    if (deleteError) {
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product, removedCount: removedProducts.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not seed the product catalog.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
