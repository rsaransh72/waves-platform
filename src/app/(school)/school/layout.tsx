import { SchoolShell } from "@/components/school/SchoolShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "School ERP | Waves Platform",
  description: "Enterprise School Management Suite",
};

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SchoolShell>{children}</SchoolShell>;
}
