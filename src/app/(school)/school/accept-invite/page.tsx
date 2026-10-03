import { SchoolInviteAcceptance } from "@/components/school/SchoolInviteAcceptance";
import { tokenLinkFromSearchParams } from "@/lib/email-link";

export const metadata = {
  title: "Accept School Invitation | Waves Platform",
};

export default async function AcceptSchoolInvitePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SchoolInviteAcceptance tokenLink={tokenLinkFromSearchParams(await searchParams)} />;
}
