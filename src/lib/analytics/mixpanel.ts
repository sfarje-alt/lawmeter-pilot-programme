// Wrapper de Mixpanel. Seguro: si no hay token configurado, todas las llamadas son no-op.
// El token es público (Project Token de Mixpanel) → seguro en frontend.

import mixpanel from "mixpanel-browser";
import type { AnalyticsEventName } from "./events";

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;
const ENABLED = Boolean(TOKEN && TOKEN.length > 0);

let initialized = false;

export function initMixpanel() {
  if (initialized || !ENABLED) return;
  try {
    mixpanel.init(TOKEN!, {
      debug: import.meta.env.DEV,
      track_pageview: false,
      persistence: "localStorage",
      ignore_dnt: true,
    });
    initialized = true;
  } catch (err) {
    console.warn("[mixpanel] init failed", err);
  }
}

interface IdentifyProfile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  account_type?: "admin" | "user" | null;
  organization_id?: string | null;
  client_id?: string | null;
}

export function identifyUser(profile: IdentifyProfile) {
  if (!ENABLED || !initialized) return;
  try {
    mixpanel.identify(profile.id);
    mixpanel.people.set({
      $email: profile.email ?? undefined,
      $name: profile.full_name ?? undefined,
      account_type: profile.account_type ?? undefined,
      organization_id: profile.organization_id ?? undefined,
      client_id: profile.client_id ?? undefined,
    });
    registerSuperProperties(profile);
  } catch (err) {
    console.warn("[mixpanel] identify failed", err);
  }
}

export function registerSuperProperties(profile: IdentifyProfile) {
  if (!ENABLED || !initialized) return;
  try {
    mixpanel.register({
      account_type: profile.account_type ?? "unknown",
      organization_id: profile.organization_id ?? null,
      client_id: profile.client_id ?? null,
      environment: import.meta.env.DEV ? "development" : "production",
    });
  } catch (err) {
    console.warn("[mixpanel] register failed", err);
  }
}

export function resetUser() {
  if (!ENABLED || !initialized) return;
  try {
    mixpanel.reset();
  } catch (err) {
    console.warn("[mixpanel] reset failed", err);
  }
}

export function trackEvent(
  event: AnalyticsEventName | string,
  properties?: Record<string, unknown>,
) {
  if (!ENABLED || !initialized) return;
  try {
    mixpanel.track(event, properties);
  } catch (err) {
    console.warn("[mixpanel] track failed", event, err);
  }
}

export const isAnalyticsEnabled = () => ENABLED;
