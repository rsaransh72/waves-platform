// Heading block used at the top of the simpler public pages.
export default function PageHero({ label, title, intro, children }: { label?: string; title: string; intro?: string | null; children?: React.ReactNode }) {
  return (
    <section className="w-full bg-white border-b border-[#e6e9f0] px-6 pt-12 pb-12 lg:px-[5%] lg:pt-[80px] lg:pb-[64px]">
      <div className="max-w-[1280px] mx-auto">
        {label && <div className="zw-label mb-5"><span>{label}</span></div>}
        <h1 className="text-[32px] sm:text-[44px] font-normal text-[#111111] tracking-tight leading-[1.15] max-w-3xl">{title}</h1>
        <div className="w-[50px] border-t-[3px] border-[#e42525] mt-6 mb-6" />
        {intro && <p className="text-[17px] text-[#444] leading-[1.7] max-w-2xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
