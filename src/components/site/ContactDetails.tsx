import { Clock, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";
import { formatPhone, phoneHref, whatsAppHref } from "@/lib/india";

// Company contact details from Admin → Settings. Lines that are not filled in are
// left out rather than shown with a placeholder.
export default function ContactDetails({ settings, heading = "Prefer to talk to us directly?" }: { settings: SiteSettings; heading?: string }) {
  const items = [
    settings.phone && { icon: PhoneCall, label: formatPhone(settings.phone), href: phoneHref(settings.phone) },
    settings.whatsapp && { icon: MessageCircle, label: `WhatsApp ${formatPhone(settings.whatsapp)}`, href: whatsAppHref(settings.whatsapp) },
    settings.sales_email && { icon: Mail, label: settings.sales_email, href: `mailto:${settings.sales_email}` },
  ].filter(Boolean) as Array<{ icon: typeof PhoneCall; label: string; href: string }>;

  if (items.length === 0 && !settings.address && !settings.business_hours) return null;

  return (
    <div className="p-5 rounded-lg bg-[#f8f9fa] border border-[#e6e9f0]">
      <p className="text-xs font-medium text-black">{heading}</p>
      <ul className="mt-3 space-y-2">
        {items.map(({ icon: Icon, label, href }) => (
          <li key={href}>
            <a href={href} className="inline-flex items-center gap-2 text-sm font-medium text-[#226eb4] hover:underline" {...(href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </a>
          </li>
        ))}
        {settings.address && (
          <li className="flex items-start gap-2 text-sm text-[#404040]">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#777]" />
            <span className="whitespace-pre-line">{settings.address}</span>
          </li>
        )}
        {settings.business_hours && (
          <li className="flex items-center gap-2 text-sm text-[#404040]">
            <Clock className="w-4 h-4 shrink-0 text-[#777]" />
            <span>{settings.business_hours}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
