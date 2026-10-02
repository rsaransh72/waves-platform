import Link from "next/link";
import { ChevronRight, GraduationCap, Layers } from "lucide-react";
import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import { getPublishedProducts, getSiteSettings, productHref } from "@/lib/site-content";

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Products | ${settings.company_name}` };
}

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <SitePage>
      <PageHero label="Products" title="Software that is ready to use today" intro="Every product listed here is in use and supported. Ask us for a demo and we will show it to you on your own workflow." />
      <section className="w-full bg-[#f9fafb] px-6 py-14 lg:px-[5%] lg:py-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#cccccc] bg-white p-10 text-center">
              <p className="text-[16px] text-[#111]">Our product pages are being updated.</p>
              <Link href="/contact" className="mt-3 inline-block text-[#0066cc] font-semibold hover:underline">Contact us for details</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const Icon = product.slug === "school-erp" ? GraduationCap : Layers;
                return (
                  <Link key={product.slug} href={productHref(product.slug)} className="group bg-white border border-[#e6e9f0] rounded-xl p-7 hover:border-[#0066cc] hover:shadow-[0_4px_12px_rgba(0,102,204,0.1)] transition-all flex flex-col">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#0066cc] flex items-center justify-center mb-5"><Icon className="w-6 h-6" /></div>
                    {product.category && <p className="text-[12px] font-bold uppercase tracking-wider text-[#777]">{product.category}</p>}
                    <h2 className="mt-1 text-[20px] font-semibold text-[#111]">{product.title}</h2>
                    {product.subtitle && <p className="mt-2 text-[14px] text-[#555] leading-relaxed">{product.subtitle}</p>}
                    {product.description && product.description !== product.subtitle && <p className="mt-3 text-[14px] text-[#555] leading-relaxed">{product.description}</p>}
                    <span className="mt-auto pt-6 text-[#0066cc] text-[13px] font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                      View details <ChevronRight className="w-4 h-4" strokeWidth={3} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SitePage>
  );
}
