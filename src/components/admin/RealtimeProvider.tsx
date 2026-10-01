"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";

export function RealtimeProvider() {
  const { 
    setRealtimeStatus, 
    reconcileProductEvent, 
    reconcileSuiteEvent,
    reconcileOrganizationEvent,
    reconcileLeadEvent,
    reconcileFeatureFlagEvent,
    reconcileTeamMemberEvent,
    reconcileSubscriptionEvent,
    reconcileTicketEvent,
    reconcileInvoiceEvent,
    reconcileAuditEvent,
    reconcileAutomationRuleEvent
  } = useAdminStore();

  useEffect(() => {
    // Suppress harmless "socket closed: 1006" errors from Next.js HMR overlay
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (e.reason && (e.reason.message?.includes("1006") || e.reason === "socket closed: 1006")) {
        e.preventDefault();
      }
    };
    const handleError = (e: ErrorEvent) => {
      if (e.message?.includes("socket closed: 1006") || e.message?.includes("1006")) {
        e.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    const supabase = createClient();
    setRealtimeStatus('CONNECTING');

    // Subscribe to all changes on the public schema
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          // Reconcile events into the Zustand global store based on table name
          switch (payload.table) {
            case 'products':
              reconcileProductEvent(payload);
              break;
            case 'suites':
              reconcileSuiteEvent(payload);
              break;
            case 'organizations':
              reconcileOrganizationEvent(payload);
              break;
            case 'leads':
              reconcileLeadEvent(payload);
              break;
            case 'feature_flags':
              reconcileFeatureFlagEvent(payload);
              break;
            case 'team_members':
              reconcileTeamMemberEvent(payload);
              break;
            case 'subscriptions':
              reconcileSubscriptionEvent(payload);
              break;
            case 'support_tickets':
              reconcileTicketEvent(payload);
              break;
            case 'invoices':
              reconcileInvoiceEvent(payload);
              break;
            case 'audit_logs':
              reconcileAuditEvent(payload);
              break;
            case 'automation_rules':
              reconcileAutomationRuleEvent(payload);
              break;
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('CONNECTED');
          console.log('✅ Connected to Supabase Realtime');
        } else if (status === 'CHANNEL_ERROR') {
          setRealtimeStatus('ERROR');
          console.error('❌ Realtime subscription error:', err);
        } else if (status === 'TIMED_OUT') {
          setRealtimeStatus('OFFLINE');
        } else if (status === 'CLOSED') {
          setRealtimeStatus('OFFLINE');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, [
    setRealtimeStatus, 
    reconcileProductEvent, 
    reconcileSuiteEvent, 
    reconcileOrganizationEvent,
    reconcileLeadEvent,
    reconcileFeatureFlagEvent,
    reconcileTeamMemberEvent,
    reconcileSubscriptionEvent,
    reconcileTicketEvent,
    reconcileInvoiceEvent,
    reconcileAuditEvent,
    reconcileAutomationRuleEvent
  ]);

  return null;
}
