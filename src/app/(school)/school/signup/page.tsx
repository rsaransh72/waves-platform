import Link from "next/link";
import { GraduationCap } from "lucide-react";

export const metadata = {
  title: "School Access | Waves Platform",
};

export default function SchoolSignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md border-t-4 border-blue-700 bg-white p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center bg-blue-700 text-white">
          <GraduationCap className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase text-blue-700">School ERP access</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Access by invitation</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A platform administrator creates your school workspace and sends the first administrator an invitation link. Ask your Waves contact to onboard your school.
        </p>
        <Link href="/school-erp#demo" className="mt-6 inline-flex items-center justify-center bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
          Request school onboarding
        </Link>
        <Link href="/school/login" className="mt-6 inline-flex items-center font-semibold text-blue-700 hover:text-blue-900">
          Already invited? Sign in
        </Link>
      </section>
    </main>
  );
}
