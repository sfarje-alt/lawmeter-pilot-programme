import { ReportsPage } from "@/components/reports/ReportsPage";

/**
 * Client portal entry point. LawMeter no longer distinguishes between admin
 * and client users — every operator sees the same reports module scoped to
 * their organization by RLS.
 */
export function ClientReports() {
  return <ReportsPage />;
}
