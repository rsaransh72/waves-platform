import { PasswordRecoveryForm } from "@/components/auth/PasswordRecoveryForm";
import { tokenLinkFromSearchParams } from "@/lib/email-link";

export const metadata = {
  title: "Reset Password | Waves Platform",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <PasswordRecoveryForm tokenLink={tokenLinkFromSearchParams(await searchParams)} />;
}
