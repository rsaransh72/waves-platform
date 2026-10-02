import { redirect } from "next/navigation";

// Products now live at /{slug}; keep old /products/{slug} links working.
export default async function ProductRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
