import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics/mixpanel";
import { AnalyticsEvents } from "@/lib/analytics/events";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    trackEvent(AnalyticsEvents.PageViewed, {
      path: location.pathname,
      search: location.search || undefined,
    });
  }, [location.pathname, location.search]);
}
