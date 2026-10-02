"use client";

import { useEffect } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";

type ChangePayload = RealtimePostgresChangesPayload<Record<string, unknown>>;

const MAX_AUTH_RETRIES = 3;

// A refused subscription carries the server's reply as `cause`, or reports a bindings
// mismatch. Everything else, such as "socket closed: 1006" or "heartbeat timeout", is
// the connection dropping, which the client retries by itself.
function isServerRejection(error: Error | undefined) {
  if (!error) return false;
  const cause: unknown = error.cause;
  return (typeof cause === "object" && cause !== null && !(cause instanceof Event)) || error.message.includes("mismatch between server and client bindings");
}

// "InvalidJWTToken: Token has expired 10524 seconds ago" and similar.
function isExpiredToken(error: Error | undefined) {
  return Boolean(error && /InvalidJWTToken|token has expired|jwt expired/i.test(error.message));
}

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
    reconcileAutomationRuleEvent,
  } = useAdminStore();

  useEffect(() => {
    const supabase = createClient();
    // Store events by table name.
    const handlers: Record<string, (payload: ChangePayload) => void> = {
      products: reconcileProductEvent,
      suites: reconcileSuiteEvent,
      organizations: reconcileOrganizationEvent,
      leads: reconcileLeadEvent,
      feature_flags: reconcileFeatureFlagEvent,
      team_members: reconcileTeamMemberEvent,
      subscriptions: reconcileSubscriptionEvent,
      support_tickets: reconcileTicketEvent,
      invoices: reconcileInvoiceEvent,
      audit_logs: reconcileAuditEvent,
      automation_rules: reconcileAutomationRuleEvent,
    };

    let channel: RealtimeChannel | null = null;
    let stopped = false;
    let authRetries = 0;

    // The realtime socket keeps the token it last sent and reuses it when it
    // reconnects. Browsers pause the session's refresh timer in background tabs and
    // while the computer sleeps, so after a long idle that token has expired. This
    // fetches the current session (refreshing an expired one) and hands it over.
    // Returns false when there is no session any more.
    const refreshRealtimeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      await supabase.realtime.setAuth(session.access_token);
      return true;
    };

    const subscribe = () => {
      setRealtimeStatus("CONNECTING");
      channel = supabase
        .channel("schema-db-changes")
        .on("postgres_changes", { event: "*", schema: "public" }, (payload: ChangePayload) => handlers[payload.table]?.(payload))
        .subscribe((status, err) => {
          if (stopped) return;
          if (status === "SUBSCRIBED") {
            authRetries = 0;
            setRealtimeStatus("CONNECTED");
          } else if (status === "CHANNEL_ERROR" && isExpiredToken(err)) {
            void resubscribeWithFreshToken();
          } else if (status === "CHANNEL_ERROR" && isServerRejection(err)) {
            setRealtimeStatus("ERROR");
            console.error("Realtime subscription refused:", err);
          } else if (status === "CHANNEL_ERROR") {
            // Sleep, a network change or a dev server restart; the channel rejoins.
            setRealtimeStatus(navigator.onLine ? "RECONNECTING" : "OFFLINE");
            console.warn("Realtime connection dropped; reconnecting.", err?.message);
          } else if (status === "TIMED_OUT" || status === "CLOSED") {
            setRealtimeStatus("OFFLINE");
          }
        });
    };

    const resubscribeWithFreshToken = async () => {
      if (authRetries >= MAX_AUTH_RETRIES) {
        setRealtimeStatus("ERROR");
        console.error("Realtime keeps rejecting the session token. Reload the page or sign in again.");
        return;
      }
      authRetries += 1;
      setRealtimeStatus("RECONNECTING");
      if (channel) await supabase.removeChannel(channel);
      channel = null;
      if (stopped) return;
      if (!(await refreshRealtimeAuth())) {
        setRealtimeStatus("OFFLINE");
        console.warn("Realtime paused: the session has ended. Sign in again to resume live updates.");
        return;
      }
      if (!stopped) subscribe();
    };

    // Hand over a fresh token before the socket rejoins after sleep or a network change.
    const onWake = () => {
      if (document.visibilityState === "visible" && navigator.onLine) void refreshRealtimeAuth().catch(() => {});
    };
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("online", onWake);

    subscribe();

    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("online", onWake);
      if (channel) void supabase.removeChannel(channel);
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
    reconcileAutomationRuleEvent,
  ]);

  return null;
}
