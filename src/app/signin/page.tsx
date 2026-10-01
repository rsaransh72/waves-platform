import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign In | Waves Platform Console",
  description: "Sign in to your Waves School Suite, Health Suite, or Pharmacy POS operational console.",
};

export default function SignInRedirect() {
  redirect("/login");
}
