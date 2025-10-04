// Parse DD/MM/YYYY format to Date object
export function parseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month, day);
}

// Format date to readable string
export function formatDate(dateStr: string | undefined | null): string {
  const date = parseDate(dateStr);
  if (!date) return "N/A";
  
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Check if date is within time window
export function isWithinTimeWindow(date: Date, window: "1w" | "2w" | "3w" | "4w"): boolean {
  const now = new Date();
  const weekMap = { "1w": 1, "2w": 2, "3w": 3, "4w": 4 };
  const weeks = weekMap[window];
  
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - (weeks * 7));
  
  return date >= cutoff && date <= now;
}

// Check if date is within range
export function isWithinDateRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

// Check if deadline is upcoming (within 30 days)
export function isUpcomingDeadline(deadlineStr: string | null): boolean {
  if (!deadlineStr) return false;
  
  const deadline = parseDate(deadlineStr);
  if (!deadline) return false;
  
  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return deadline >= now && deadline <= thirtyDaysFromNow;
}

// Get days since date
export function daysSince(dateStr: string): number {
  const date = parseDate(dateStr);
  if (!date) return 0;
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Get one year ago date
export function getOneYearAgo(): Date {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return oneYearAgo;
}
