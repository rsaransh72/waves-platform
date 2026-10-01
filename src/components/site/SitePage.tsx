import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/site/SiteFooter";

// Header, page content and footer shared by every public page.
export default function SitePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter />
    </div>
  );
}
