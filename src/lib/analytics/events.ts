// Catálogo central de nombres de eventos Mixpanel.
// Mantener nombres en formato "Título Caso" para consistencia en dashboards.

export const AnalyticsEvents = {
  // Auth
  UserSignedUp: "User Signed Up",
  UserSignedIn: "User Signed In",
  UserSignedOut: "User Signed Out",
  PasswordResetRequested: "Password Reset Requested",

  // Navegación
  PageViewed: "Page Viewed",
  TabChanged: "Tab Changed",

  // Alertas
  AlertOpened: "Alert Opened",
  AlertFilterApplied: "Alert Filter Applied",
  AlertSearchPerformed: "Alert Search Performed",
  AlertPinned: "Alert Pinned",
  AlertUnpinned: "Alert Unpinned",
  AlertPublished: "Alert Published",
  AlertCommentarySaved: "Alert Commentary Saved",
  AlertFeedbackSubmitted: "Alert Feedback Submitted",
  AlertStageChanged: "Alert Stage Changed",

  // Reportes
  ReportGenerated: "Report Generated",
  ReportPdfDownloaded: "Report PDF Downloaded",
  ReportConfigCreated: "Report Config Created",
  ReportConfigUpdated: "Report Config Updated",
  ReportConfigDeleted: "Report Config Deleted",

  // Sesiones
  SessionOpened: "Session Opened",
  SessionPublished: "Session Published",
  SessionQAAsked: "Session QA Asked",
  SessionTranscriptRequested: "Session Transcript Requested",

  // Analíticas
  AnalyticsDashboardViewed: "Analytics Dashboard Viewed",
  AnalyticsDrilldownOpened: "Analytics Drilldown Opened",
  AnalyticsLayoutCustomized: "Analytics Layout Customized",

  // Calendario
  CalendarEventClicked: "Calendar Event Clicked",

  // Carga manual
  ManualAlertsUploadStarted: "Manual Alerts Upload Started",
  ManualAlertsUploadConfirmed: "Manual Alerts Upload Confirmed",

  // IA
  AIFeatureUsed: "AI Feature Used",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
