import { notFound } from "next/navigation";

// The parent portal is disabled until parents sign in with their own accounts.
// ParentPortalView is kept for that rebuild.
export default function StudentPortalPage() {
  notFound();
}
