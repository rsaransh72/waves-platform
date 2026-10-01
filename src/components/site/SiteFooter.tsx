import Link from "next/link";
import { getPublishedPages, getPublishedProducts, getPublishedServices, getSiteSettings, productHref } from "@/lib/site-content";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function SiteFooter() {
  const [settings, products, services, pages] = await Promise.all([
    getSiteSettings(),
    getPublishedProducts(),
    getPublishedServices(),
    getPublishedPages(),
  ]);
  const contactLines = [
    settings.phone && { label: settings.phone, href: telHref(settings.phone) },
    settings.sales_email && { label: settings.sales_email, href: `mailto:${settings.sales_email}` },
    settings.support_email && settings.support_email !== settings.sales_email && { label: `Support: ${settings.support_email}`, href: `mailto:${settings.support_email}` },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <footer className="w-full bg-[#0a0a0a] text-[#aaa] text-xs px-6 py-12 lg:px-[5%] lg:pt-[64px] lg:pb-[48px]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-[#222]">
          {products.length > 0 && (
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Products</p>
              <ul className="space-y-2.5">
                {products.map((product) => (
                  <li key={product.slug}><Link href={productHref(product.slug)} className="hover:text-white transition">{product.title}</Link></li>
                ))}
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
          )}

          {services.length > 0 && (
            <div>
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Services</p>
              <ul className="space-y-2.5">
                {services.map((service) => (
                  <li key={service.slug}><Link href={`/services#${service.slug}`} className="hover:text-white transition">{service.title}</Link></li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Get started</p>
            <ul className="space-y-2.5">
              <li><Link href="/book-demo" className="hover:text-white transition font-medium text-[#f87171]">Request a demo</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact us</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-4">Contact</p>
            <ul className="space-y-2.5">
              {contactLines.map((line) => (
                <li key={line.href}><a href={line.href} className="hover:text-white transition break-all">{line.label}</a></li>
              ))}
              {settings.address && <li className="whitespace-pre-line leading-relaxed">{settings.address}</li>}
              {settings.business_hours && <li>{settings.business_hours}</li>}
              {contactLines.length === 0 && !settings.address && <li><Link href="/contact" className="hover:text-white transition">Send us a message</Link></li>}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#777]">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#e42525]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#226eb4]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#10b981]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#f59e0b]" />
            </div>
            <span className="font-bold text-[#ccc] uppercase">{settings.company_name}</span>
            {settings.tagline && <><span>•</span><span>{settings.tagline}</span></>}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {pages.map((page) => (
              <Link key={page.slug} href={`/${page.slug}`} className="hover:text-[#ccc] transition">{page.title}</Link>
            ))}
            <p>&copy; {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
