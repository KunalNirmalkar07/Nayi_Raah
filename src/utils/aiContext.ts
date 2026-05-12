/**
 * aiContext.ts
 * Builds a rich, structured system-prompt context block for the AI career chat.
 * Injects college details (admission dates, fees, branches, scholarships, placements)
 * and scholarship details (dates, eligibility, income limits) so the AI responds
 * with specific, actionable, verified information instead of generic answers.
 */

import { colleges } from "@/data/colleges";
import { scholarships } from "@/data/scholarships";

/** Returns a compact text block summarising all college & scholarship data. */
export function buildAIContext(): string {
  const collegeLines = colleges.map((c) => {
    const parts = [
      `[${c.shortName ?? c.name}]`,
      `Type:${c.type}`,
      `State:${c.state}`,
      `City:${c.city}`,
      c.nirfRank ? `NIRF:#${c.nirfRank}` : null,
      `Exam:${c.exams.join("/")}`,
      c.admissionStart ? `AdmOpen:${c.admissionStart}` : null,
      c.admissionEnd   ? `AdmClose:${c.admissionEnd}` : null,
      c.admissionPortal ? `Portal:${c.admissionPortal}` : null,
      c.annualFees     ? `Fees:${c.annualFees}` : null,
      c.hostelAvailable ? `Hostel:Yes(${c.hostelFees ?? "contact college"})` : null,
      c.totalSeats     ? `Seats:${c.totalSeats}` : null,
      c.branches?.length ? `Branches:${c.branches.join(", ")}` : null,
      c.avgPackage     ? `AvgPkg:${c.avgPackage}` : null,
      c.highestPackage ? `HighestPkg:${c.highestPackage}` : null,
      c.eligibleScholarshipIds?.length
        ? `EligibleScholarships:${c.eligibleScholarshipIds.join(",")}`
        : null,
    ].filter(Boolean);
    return parts.join(" | ");
  });

  const scholarshipLines = scholarships.map((s) => {
    const statesStr = Array.isArray(s.states) ? s.states.join("/") : s.states;
    const parts = [
      `[Scholarship-${s.id}:${s.name}]`,
      `Provider:${s.provider}`,
      `Amount:${s.amount}`,
      s.applicationOpenDate  ? `AppOpen:${s.applicationOpenDate}` : null,
      s.applicationCloseDate ? `AppClose:${s.applicationCloseDate}` : null,
      `Deadline:${s.deadline}`,
      `Category:${s.category}`,
      s.incomeLimit ? `IncomeLimit:${s.incomeLimit}` : null,
      `States:${statesStr}`,
      `Level:${s.educationLevels.join("/")}`,
      `Eligibility:${s.eligibility.join("; ")}`,
      `URL:${s.url}`,
      s.contactEmail ? `Contact:${s.contactEmail}` : null,
    ].filter(Boolean);
    return parts.join(" | ");
  });

  return `
=== NAYI RAAH KNOWLEDGE BASE (use this for factual answers) ===

--- COLLEGES (${colleges.length} institutions) ---
${collegeLines.join("\n")}

--- SCHOLARSHIPS (${scholarships.length} schemes) ---
${scholarshipLines.join("\n")}

INSTRUCTIONS FOR AI:
- When asked about a college: always mention admission dates, fees, hostel, branches, and relevant scholarships.
- When asked about scholarships: always mention application open/close dates, income limit, eligible states, and apply link.
- When recommending scholarships for a student: match their state, category (SC/ST/OBC/Women/Merit etc.), and education level.
- Always link colleges ↔ scholarships using EligibleScholarships IDs.
- Dates are for academic year 2026-27. Advise students to verify on official portals before applying.
=== END OF KNOWLEDGE BASE ===
`.trim();
}
