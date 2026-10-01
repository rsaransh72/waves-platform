import Link from "next/link";

export const metadata = {
  title: "Access Denied | Waves Platform",
};

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const isSchool = area === "school";
  const isClient = area === "client";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-lg border-t-4 border-red-700 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase text-red-700">Access restricted</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">This account is not authorized</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isSchool
            ? "This account does not have one active school workspace membership. Contact your school administrator."
            : isClient
              ? "This account does not have one active client workspace membership. Contact your organization administrator."
              : "This account is not an active platform administrator. Contact the Waves platform owner."}
        </p>
        <Link href={isSchool ? "/school/login" : isClient ? "/login" : "/admin/login"} className="mt-6 inline-flex font-semibold text-blue-700 hover:text-blue-900">
          Return to sign in
        </Link>
      </section>
    </main>
  );
}