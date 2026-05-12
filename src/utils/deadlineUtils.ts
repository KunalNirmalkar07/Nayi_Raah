import { scholarships, type Scholarship } from "@/data/scholarships";

const MONTH_MAP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/**
 * Parse deadline strings like "October 2026" into a Date (last day of that month).
 * Returns null for "Rolling", "Varies", etc.
 */
export function parseDeadline(deadline: string): Date | null {
  const lower = deadline.toLowerCase().trim();
  if (lower === "rolling" || lower.startsWith("varies")) return null;

  const parts = lower.split(/\s+/);
  if (parts.length < 2) return null;

  const monthIndex = MONTH_MAP[parts[0]];
  const year = parseInt(parts[1], 10);

  if (monthIndex === undefined || isNaN(year)) return null;

  // Use the last day of the month as deadline
  return new Date(year, monthIndex + 1, 0);
}

export type DeadlineUrgency = "overdue" | "urgent" | "approaching" | "safe" | "unknown";

export interface ScholarshipDeadlineInfo {
  scholarship: Scholarship;
  deadlineDate: Date | null;
  daysLeft: number | null;
  urgency: DeadlineUrgency;
}

/**
 * Get deadline info with urgency classification.
 * - overdue: past deadline
 * - urgent: <= 30 days
 * - approaching: <= 60 days
 * - safe: > 60 days
 * - unknown: Rolling/unparseable
 */
export function getDeadlineInfo(scholarship: Scholarship): ScholarshipDeadlineInfo {
  const deadlineDate = parseDeadline(scholarship.deadline);

  if (!deadlineDate) {
    return { scholarship, deadlineDate: null, daysLeft: null, urgency: "unknown" };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let urgency: DeadlineUrgency;
  if (daysLeft < 0) urgency = "overdue";
  else if (daysLeft <= 30) urgency = "urgent";
  else if (daysLeft <= 60) urgency = "approaching";
  else urgency = "safe";

  return { scholarship, deadlineDate, daysLeft, urgency };
}

/**
 * Get upcoming deadline reminders for saved scholarships, sorted by urgency.
 */
export function getSavedDeadlineReminders(savedIds: Set<string>): ScholarshipDeadlineInfo[] {
  if (savedIds.size === 0) return [];

  return scholarships
    .filter((s) => savedIds.has(s.id))
    .map(getDeadlineInfo)
    .filter((info) => info.urgency !== "unknown")
    .sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
}
