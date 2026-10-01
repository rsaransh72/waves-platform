import { notFound } from "next/navigation";
import SitePage from "@/components/site/SitePage";
import PageHero from "@/components/site/PageHero";
import { getPublishedPage, getSiteSettings } from "@/lib/site-content";

export const revalidate = 0;

// Content pages written in Admin → Pages (About, Terms, Privacy, ...). Fixed routes
// such as /pricing take precedence over this one.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  if (!page) return {};
  return {
    title: page.seo_title || `${page.title} | ${settings.company_name}`,
    description: page.seo_description ?? undefined,
  };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  return (
    <SitePage>
      <PageHero title={page.title} />
      <section className="w-full bg-white px-6 py-12 lg:px-[5%] lg:py-[64px]">
        <article className="max-w-[760px] mx-auto space-y-10">
          {page.blocks.map((section, index) => (
            <section key={index}>
              {section.heading && <h2 className="text-[22px] font-semibold text-[#111] mb-3">{section.heading}</h2>}
              {section.body?.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-[16px] text-[#404040] leading-[1.8] mb-4 whitespace-pre-line">{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </section>
    </SitePage>
  );
}
