import { redirect } from "next/navigation";

export default function SchoolLoginRedirect() {
  redirect("/login?next=%2Fschool");
}
