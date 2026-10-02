"use client";

import { createContext, useContext } from "react";
import { canManageSchoolArea, type SchoolArea, type SchoolRole } from "@/lib/school-permissions";
import type { BillingNotice } from "@/lib/school-account";

export type SchoolSession = {
  email: string;
  name: string | null;
  role: SchoolRole;
  schoolName: string;
  // Shown to the school administrator only.
  billing: BillingNotice | null;
};

const SchoolSessionContext = createContext<SchoolSession | null>(null);

export function SchoolSessionProvider({ session, children }: { session: SchoolSession | null; children: React.ReactNode }) {
  return <SchoolSessionContext.Provider value={session}>{children}</SchoolSessionContext.Provider>;
}

export function useSchoolSession() {
  return useContext(SchoolSessionContext);
}

// Hides create/edit/delete controls for roles the database would reject anyway.
export function useCanManage(area: SchoolArea) {
  const session = useContext(SchoolSessionContext);
  return session ? canManageSchoolArea(session.role, area) : false;
}
