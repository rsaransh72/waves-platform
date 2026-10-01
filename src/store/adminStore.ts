/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

type RealtimeStatus = 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'OFFLINE' | 'ERROR';

export interface EntityState<T> {
  data: Record<string, T>;
  loading: boolean;
  error: string | null;
}

interface AdminState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  realtimeStatus: RealtimeStatus;
  setRealtimeStatus: (status: RealtimeStatus) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;

  products: EntityState<any>;
  setProducts: (items: any[]) => void;
  addProduct: (item: any) => void;
  updateProduct: (id: string, updates: any) => void;
  removeProduct: (id: string) => void;
  reconcileProductEvent: (payload: any) => void;

  suites: EntityState<any>;
  setSuites: (items: any[]) => void;
  addSuite: (item: any) => void;
  updateSuite: (id: string, updates: any) => void;
  removeSuite: (id: string) => void;
  reconcileSuiteEvent: (payload: any) => void;

  organizations: EntityState<any>;
  setOrganizations: (items: any[]) => void;
  addOrganization: (item: any) => void;
  updateOrganization: (id: string, updates: any) => void;
  removeOrganization: (id: string) => void;
  reconcileOrganizationEvent: (payload: any) => void;

  leads: EntityState<any>;
  setLeads: (items: any[]) => void;
  addLead: (item: any) => void;
  updateLead: (id: string, updates: any) => void;
  removeLead: (id: string) => void;
  reconcileLeadEvent: (payload: any) => void;

  featureFlags: EntityState<any>;
  setFeatureFlags: (items: any[]) => void;
  addFeatureFlag: (item: any) => void;
  updateFeatureFlag: (id: string, updates: any) => void;
  removeFeatureFlag: (id: string) => void;
  reconcileFeatureFlagEvent: (payload: any) => void;

  teamMembers: EntityState<any>;
  setTeamMembers: (items: any[]) => void;
  addTeamMember: (item: any) => void;
  updateTeamMember: (id: string, updates: any) => void;
  removeTeamMember: (id: string) => void;
  reconcileTeamMemberEvent: (payload: any) => void;

  subscriptions: EntityState<any>;
  setSubscriptions: (items: any[]) => void;
  updateSubscription: (id: string, updates: any) => void;
  reconcileSubscriptionEvent: (payload: any) => void;

  tickets: EntityState<any>;
  setTickets: (items: any[]) => void;
  updateTicket: (id: string, updates: any) => void;
  reconcileTicketEvent: (payload: any) => void;

  invoices: EntityState<any>;
  setInvoices: (items: any[]) => void;
  updateInvoice: (id: string, updates: any) => void;
  reconcileInvoiceEvent: (payload: any) => void;

  auditLogs: EntityState<any>;
  setAuditLogs: (items: any[]) => void;
  addAuditLog: (item: any) => void;
  reconcileAuditEvent: (payload: any) => void;

  media: EntityState<any>;
  setMedia: (items: any[]) => void;
  addMedia: (item: any) => void;
  removeMedia: (id: string) => void;
  updateMedia: (id: string, updates: any) => void;

  pages: EntityState<any>;
  setPages: (items: any[]) => void;
  addPage: (item: any) => void;
  removePage: (id: string) => void;
  updatePage: (id: string, updates: any) => void;

  automationRules: EntityState<any>;
  setAutomationRules: (items: any[]) => void;
  addAutomationRule: (item: any) => void;
  removeAutomationRule: (id: string) => void;
  updateAutomationRule: (id: string, updates: any) => void;
  reconcileAutomationRuleEvent: (payload: any) => void;
}

function arrayToRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  return arr.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, T>);
}

function handleRealtimeEvent<T>(
  currentState: Record<string, T>, 
  payload: any
): Record<string, T> {
  const { eventType, new: newRecord, old: oldRecord } = payload;
  const nextState = { ...currentState };

  if (eventType === 'INSERT' || eventType === 'UPDATE') {
    if (newRecord && newRecord.id) {
      nextState[newRecord.id] = {
        ...nextState[newRecord.id],
        ...newRecord
      };
    }
  } else if (eventType === 'DELETE') {
    if (oldRecord && oldRecord.id) {
      delete nextState[oldRecord.id];
    }
  }
  return nextState;
}

const initialEntityState = { data: {}, loading: true, error: null };

export const useAdminStore = create<AdminState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  realtimeStatus: 'CONNECTING',
  setRealtimeStatus: (status) => set({ realtimeStatus: status }),
  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),

  // Products
  products: { ...initialEntityState },
  setProducts: (items) => set({ products: { data: arrayToRecord(items), loading: false, error: null } }),
  addProduct: (item) => set((state) => ({ products: { ...state.products, data: { ...state.products.data, [item.id]: item } } })),
  updateProduct: (id, updates) => set((state) => ({
    products: {
      ...state.products,
      data: { ...state.products.data, [id]: { ...state.products.data[id], ...updates } }
    }
  })),
  removeProduct: (id) => set((state) => {
    const nextData = { ...state.products.data };
    delete nextData[id];
    return { products: { ...state.products, data: nextData } };
  }),
  reconcileProductEvent: (payload) => set((state) => ({ products: { ...state.products, data: handleRealtimeEvent(state.products.data, payload) } })),

  // Suites
  suites: { ...initialEntityState },
  setSuites: (items) => set({ suites: { data: arrayToRecord(items), loading: false, error: null } }),
  addSuite: (item) => set((state) => ({ suites: { ...state.suites, data: { ...state.suites.data, [item.id]: item } } })),
  updateSuite: (id, updates) => set((state) => ({
    suites: {
      ...state.suites,
      data: { ...state.suites.data, [id]: { ...state.suites.data[id], ...updates } }
    }
  })),
  removeSuite: (id) => set((state) => {
    const nextData = { ...state.suites.data };
    delete nextData[id];
    return { suites: { ...state.suites, data: nextData } };
  }),
  reconcileSuiteEvent: (payload) => set((state) => ({ suites: { ...state.suites, data: handleRealtimeEvent(state.suites.data, payload) } })),

  // Organizations (Customers)
  organizations: { ...initialEntityState },
  setOrganizations: (items) => set({ organizations: { data: arrayToRecord(items), loading: false, error: null } }),
  addOrganization: (item) => set((state) => ({ organizations: { ...state.organizations, data: { ...state.organizations.data, [item.id]: item } } })),
  updateOrganization: (id, updates) => set((state) => ({
    organizations: {
      ...state.organizations,
      data: { ...state.organizations.data, [id]: { ...state.organizations.data[id], ...updates } }
    }
  })),
  removeOrganization: (id) => set((state) => {
    const nextData = { ...state.organizations.data };
    delete nextData[id];
    return { organizations: { ...state.organizations, data: nextData } };
  }),
  reconcileOrganizationEvent: (payload) => set((state) => ({ organizations: { ...state.organizations, data: handleRealtimeEvent(state.organizations.data, payload) } })),

  // Leads
  leads: { ...initialEntityState },
  setLeads: (items) => set({ leads: { data: arrayToRecord(items), loading: false, error: null } }),
  addLead: (item) => set((state) => ({ leads: { ...state.leads, data: { ...state.leads.data, [item.id]: item } } })),
  updateLead: (id, updates) => set((state) => ({
    leads: {
      ...state.leads,
      data: { ...state.leads.data, [id]: { ...state.leads.data[id], ...updates } }
    }
  })),
  removeLead: (id) => set((state) => {
    const nextData = { ...state.leads.data };
    delete nextData[id];
    return { leads: { ...state.leads, data: nextData } };
  }),
  reconcileLeadEvent: (payload) => set((state) => ({ leads: { ...state.leads, data: handleRealtimeEvent(state.leads.data, payload) } })),

  // Feature Flags
  featureFlags: { ...initialEntityState },
  setFeatureFlags: (items) => set({ featureFlags: { data: arrayToRecord(items), loading: false, error: null } }),
  addFeatureFlag: (item) => set((state) => ({ featureFlags: { ...state.featureFlags, data: { ...state.featureFlags.data, [item.id]: item } } })),
  updateFeatureFlag: (id, updates) => set((state) => ({
    featureFlags: {
      ...state.featureFlags,
      data: { ...state.featureFlags.data, [id]: { ...state.featureFlags.data[id], ...updates } }
    }
  })),
  removeFeatureFlag: (id) => set((state) => {
    const nextData = { ...state.featureFlags.data };
    delete nextData[id];
    return { featureFlags: { ...state.featureFlags, data: nextData } };
  }),
  reconcileFeatureFlagEvent: (payload) => set((state) => ({ featureFlags: { ...state.featureFlags, data: handleRealtimeEvent(state.featureFlags.data, payload) } })),

  // Team Members
  teamMembers: { ...initialEntityState },
  setTeamMembers: (items) => set({ teamMembers: { data: arrayToRecord(items), loading: false, error: null } }),
  addTeamMember: (item) => set((state) => ({ teamMembers: { ...state.teamMembers, data: { ...state.teamMembers.data, [item.id]: item } } })),
  updateTeamMember: (id, updates) => set((state) => ({
    teamMembers: {
      ...state.teamMembers,
      data: { ...state.teamMembers.data, [id]: { ...state.teamMembers.data[id], ...updates } }
    }
  })),
  removeTeamMember: (id) => set((state) => {
    const nextData = { ...state.teamMembers.data };
    delete nextData[id];
    return { teamMembers: { ...state.teamMembers, data: nextData } };
  }),
  reconcileTeamMemberEvent: (payload) => set((state) => ({ teamMembers: { ...state.teamMembers, data: handleRealtimeEvent(state.teamMembers.data, payload) } })),

  // Subscriptions
  subscriptions: { ...initialEntityState },
  setSubscriptions: (items) => set({ subscriptions: { data: arrayToRecord(items), loading: false, error: null } }),
  updateSubscription: (id, updates) => set((state) => ({
    subscriptions: {
      ...state.subscriptions,
      data: { ...state.subscriptions.data, [id]: { ...state.subscriptions.data[id], ...updates } }
    }
  })),
  reconcileSubscriptionEvent: (payload) => set((state) => ({ subscriptions: { ...state.subscriptions, data: handleRealtimeEvent(state.subscriptions.data, payload) } })),

  // Tickets
  tickets: { ...initialEntityState },
  setTickets: (items) => set({ tickets: { data: arrayToRecord(items), loading: false, error: null } }),
  updateTicket: (id, updates) => set((state) => ({
    tickets: {
      ...state.tickets,
      data: { ...state.tickets.data, [id]: { ...state.tickets.data[id], ...updates } }
    }
  })),
  reconcileTicketEvent: (payload) => set((state) => ({ tickets: { ...state.tickets, data: handleRealtimeEvent(state.tickets.data, payload) } })),

  // Invoices
  invoices: { ...initialEntityState },
  setInvoices: (items) => set({ invoices: { data: arrayToRecord(items), loading: false, error: null } }),
  updateInvoice: (id, updates) => set((state) => ({
    invoices: {
      ...state.invoices,
      data: { ...state.invoices.data, [id]: { ...state.invoices.data[id], ...updates } }
    }
  })),
  reconcileInvoiceEvent: (payload) => set((state) => ({ invoices: { ...state.invoices, data: handleRealtimeEvent(state.invoices.data, payload) } })),

  // Audit Logs
  auditLogs: { ...initialEntityState },
  setAuditLogs: (items) => set({ auditLogs: { data: arrayToRecord(items), loading: false, error: null } }),
  addAuditLog: (item) => set((state) => ({ auditLogs: { ...state.auditLogs, data: { ...state.auditLogs.data, [item.id]: item } } })),
  reconcileAuditEvent: (payload) => set((state) => ({ auditLogs: { ...state.auditLogs, data: handleRealtimeEvent(state.auditLogs.data, payload) } })),

  // Media
  media: { ...initialEntityState },
  setMedia: (items) => set({ media: { data: arrayToRecord(items), loading: false, error: null } }),
  addMedia: (item) => set((state) => ({ media: { ...state.media, data: { [item.id]: item, ...state.media.data } } })),
  removeMedia: (id) => set((state) => {
    const newData = { ...state.media.data };
    delete newData[id];
    return { media: { ...state.media, data: newData } };
  }),
  updateMedia: (id, updates) => set((state) => ({
    media: {
      ...state.media,
      data: { ...state.media.data, [id]: { ...state.media.data[id], ...updates } }
    }
  })),

  // Pages
  pages: { ...initialEntityState },
  setPages: (items) => set({ pages: { data: arrayToRecord(items), loading: false, error: null } }),
  addPage: (item) => set((state) => ({ pages: { ...state.pages, data: { [item.id]: item, ...state.pages.data } } })),
  removePage: (id) => set((state) => {
    const newData = { ...state.pages.data };
    delete newData[id];
    return { pages: { ...state.pages, data: newData } };
  }),
  updatePage: (id, updates) => set((state) => ({
    pages: {
      ...state.pages,
      data: { ...state.pages.data, [id]: { ...state.pages.data[id], ...updates } }
    }
  })),

  // Automation Rules
  automationRules: { ...initialEntityState },
  setAutomationRules: (items) => set({ automationRules: { data: arrayToRecord(items), loading: false, error: null } }),
  addAutomationRule: (item) => set((state) => ({ automationRules: { ...state.automationRules, data: { [item.id]: item, ...state.automationRules.data } } })),
  removeAutomationRule: (id) => set((state) => {
    const newData = { ...state.automationRules.data };
    delete newData[id];
    return { automationRules: { ...state.automationRules, data: newData } };
  }),
  updateAutomationRule: (id, updates) => set((state) => ({
    automationRules: {
      ...state.automationRules,
      data: { ...state.automationRules.data, [id]: { ...state.automationRules.data[id], ...updates } }
    }
  })),
  reconcileAutomationRuleEvent: (payload) => set((state) => ({ automationRules: { ...state.automationRules, data: handleRealtimeEvent(state.automationRules.data, payload) } }))
}));
