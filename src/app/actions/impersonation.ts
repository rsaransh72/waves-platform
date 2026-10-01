"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requirePlatformAdmin } from "@/lib/supabase-server";

export async function impersonateUser(userId: string, userName: string, userEmail: string, returnPath: string = "/admin/users") {
  const { supabase, user } = await requirePlatformAdmin();

  const impersonationData = {
    userId,
    userName,
    userEmail,
    returnPath: returnPath.startsWith("/admin") ? returnPath : "/admin/users",
    timestamp: Date.now()
  };

  const cookieStore = await cookies();
  cookieStore.set("impersonation_session", JSON.stringify(impersonationData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600 // 1 hour
  });

  await supabase.from("audit_logs").insert([{
    action: "user.impersonated",
    resource_type: "users",
    actor_id: user.id,
    actor_email: user.email,
    details: { impersonated_user_id: userId, impersonated_name: userName, impersonated_email: userEmail },
  }]);

  redirect("/dashboard");
}

export async function endImpersonation() {
  const cookieStore = await cookies();
  const impersonationCookie = cookieStore.get("impersonation_session");
  let returnPath = "/admin/users";

  if (impersonationCookie) {
    try {
      const data = JSON.parse(impersonationCookie.value);
      if (typeof data.returnPath === "string" && data.returnPath.startsWith("/admin")) returnPath = data.returnPath;
    } catch {}
  }

  cookieStore.delete("impersonation_session");
  redirect(returnPath);
}
