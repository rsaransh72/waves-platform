import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js";

// Invitation and password-reset emails open a page in this app. The email templates
// (supabase/email-templates) link with ?token_hash=…&type=…, which the page verifies
// with verifyOtp() only when the person acts, so link scanners that fetch the page
// cannot use up the one-time token. Older emails sent with Supabase's default
// template put the session in the URL hash instead (#access_token=…); the browser
// client runs in PKCE mode and ignores those, so they are handled here as well.

const OTP_TYPES = ["invite", "recovery", "magiclink", "signup", "email"] as const;

export type EmailLink =
  | { kind: "token"; tokenHash: string; type: EmailOtpType }
  | { kind: "session"; accessToken: string; refreshToken: string }
  | { kind: "error"; message: string }
  | { kind: "none" };

// The ?token_hash link, read by the page on the server so the first render already knows it.
export function tokenLinkFromSearchParams(params: Record<string, string | string[] | undefined>): EmailLink {
  const { token_hash: tokenHash, type } = params;
  return typeof tokenHash === "string" && OTP_TYPES.includes(type as typeof OTP_TYPES[number])
    ? { kind: "token", tokenHash, type: type as EmailOtpType }
    : { kind: "none" };
}

export function readEmailLink(): EmailLink {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  const errorCode = hash.get("error_code") ?? query.get("error_code");
  const errorDescription = hash.get("error_description") ?? query.get("error_description");
  if (errorCode || errorDescription) {
    return {
      kind: "error",
      message: errorCode === "otp_expired"
        ? "This link has expired or has already been used."
        : errorDescription?.replace(/\+/g, " ") || "This link is not valid.",
    };
  }

  const tokenLink = tokenLinkFromSearchParams(Object.fromEntries(query));
  if (tokenLink.kind === "token") return tokenLink;

  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  if (accessToken && refreshToken) return { kind: "session", accessToken, refreshToken };

  return { kind: "none" };
}

// Removes the token from the address bar so it is not kept in history or shared by copy-paste.
export function clearEmailLink() {
  window.history.replaceState(null, "", window.location.pathname);
}

// Signs the browser in from the link. Returns an error message, or null on success.
export async function openEmailLink(supabase: SupabaseClient, link: EmailLink): Promise<string | null> {
  if (link.kind === "error") return link.message;
  if (link.kind === "token") {
    const { error } = await supabase.auth.verifyOtp({ token_hash: link.tokenHash, type: link.type });
    if (error) return /expired|invalid/i.test(error.message) ? "This link has expired or has already been used." : error.message;
  } else if (link.kind === "session") {
    const { error } = await supabase.auth.setSession({ access_token: link.accessToken, refresh_token: link.refreshToken });
    if (error) return "This link has expired or has already been used.";
  } else {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return "This link is missing or has expired.";
  }
  clearEmailLink();
  return null;
}
