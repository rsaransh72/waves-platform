// Which workspace a client of each product signs in to. Only School ERP has its own
// workspace today; a client of any other product gets the generic client workspace.
export type OrganizationType = "school" | "hospital" | "pharmacy" | "other";

const PRODUCT_WORKSPACES: Record<string, OrganizationType> = {
  "school-erp": "school",
};

export function organizationTypeForProduct(productSlug: string): OrganizationType {
  return PRODUCT_WORKSPACES[productSlug] ?? "other";
}

export function workspaceLabel(type: string) {
  return type === "school" ? "School ERP" : "Client workspace";
}
