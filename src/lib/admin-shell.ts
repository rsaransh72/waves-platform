// What the admin sidebar and header show about the signed-in administrator and the
// work waiting for them; loaded on the server by the admin layout.
export type AdminShellData = {
  admin: { name: string; email: string; role: string };
  counts: { newLeads: number; dueFollowUps: number };
};
