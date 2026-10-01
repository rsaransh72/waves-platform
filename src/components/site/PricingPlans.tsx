import Link from "next/link";
import { Check } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { planPrice, type PricingPlan } from "@/lib/site-content";

// A product's plans as entered in Admin → Products → Pricing. A plan without a numeric
// price shows its text (e.g. "On request") and asks for a quote instead of a figure.
export default function PricingPlans({ plans, productSlug, productTitle }: { plans: PricingPlan[]; productSlug: string; productTitle: string }) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-[#e6e9f0] bg-white p-8 text-center">
        <p className="text-[18px] font-semibold text-[#111]">Pricing on request</p>
        <p className="mt-2 text-[15px] text-[#555] max-w-xl mx-auto">
          The price for {productTitle} depends on the size of your institution and the modules you need. Ask for a quote and we will send one based on your details.
        </p>
        <Link href={`/pricing?product=${productSlug}#quote`} className="mt-5 inline-flex bg-[#e42525] hover:bg-[#d11a1a] text-white px-6 py-3 text-[13px] font-bold uppercase tracking-wider rounded-[3px]">
          Request a quote
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${plans.length === 1 ? "max-w-md mx-auto" : plans.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {plans.map((plan) => {
        const price = planPrice(plan);
        const numeric = typeof price === "number";
        return (
          <div key={plan.name} className={`relative bg-white rounded-xl p-7 flex flex-col ${plan.highlighted ? "border-2 border-[#0066cc] shadow-[0_8px_30px_rgba(0,102,204,0.12)]" : "border border-[#e6e9f0]"}`}>
            {plan.highlighted && (
              <span className="absolute -top-3 left-7 bg-[#0066cc] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Recommended</span>
            )}
            <h3 className="text-[20px] font-semibold text-[#111]">{plan.name}</h3>
            {plan.description && <p className="mt-1 text-[14px] text-[#555]">{plan.description}</p>}
            <div className="mt-5">
              {price === null ? (
                <p className="text-[22px] font-semibold text-[#111]">Pricing on request</p>
              ) : (
                <p className="text-[32px] font-semibold text-[#111] leading-none">
                  {numeric ? formatMoney(price) : price}
                  {numeric && plan.period && <span className="text-[14px] font-normal text-[#555]"> / {plan.period}</span>}
                </p>
              )}
              {numeric && <p className="mt-1 text-[12px] text-[#777]">Taxes as applicable</p>}
            </div>
            {plan.features && plan.features.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[14px] text-[#404040]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={numeric ? `/book-demo?product=${productSlug}` : `/pricing?product=${productSlug}#quote`}
              className={`mt-8 block text-center py-3 rounded-[3px] text-[13px] font-bold uppercase tracking-wider transition-colors ${plan.highlighted ? "bg-[#0066cc] hover:bg-[#005bb5] text-white" : "border border-[#0066cc] text-[#0066cc] hover:bg-blue-50"}`}
            >
              {numeric ? "Get started" : "Request a quote"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
