// Shared types/helpers for real applications — no Supabase client import
// here, so this is safe to import from both server and client code.
// See real-applications.ts (server fetch) and
// real-applications-client.ts (client update).

export type ApplicationKind = "internship" | "job";
export type ApplicationStatus = "new" | "under-review" | "interview" | "accepted" | "rejected";

export type AdminApplication = {
  /** "internship:<uuid>" or "job:<uuid>" — composite so ids never collide across tables. */
  id: string;
  kind: ApplicationKind;
  name: string;
  email: string;
  phone: string;
  location: string;
  roleLabel: string;
  status: ApplicationStatus;
  motivation: string;
  skills: string;
  portfolio: string;
  github: string;
  linkedin: string;
  createdAt: string;
  // internship-only
  education?: string;
  fieldOfStudy?: string;
  year?: string;
  learningGoals?: string;
  // job-only
  currentPosition?: string;
  experienceLevel?: string;
  experience?: string;
  resumeFileName?: string;
};

export type InternshipRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  program: string;
  education: string;
  field_of_study: string;
  year: string;
  motivation: string;
  learning_goals: string;
  skills: string;
  portfolio: string;
  github: string;
  linkedin: string;
  status: "NEW" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  created_at: string;
};

export type JobRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  job_id: string;
  current_position: string;
  experience_level: string;
  experience: string;
  skills: string;
  portfolio: string;
  github: string;
  linkedin: string;
  motivation: string;
  resume_file_name: string;
  status: "NEW" | "UNDER_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  created_at: string;
};

export function statusFromDb(status: string): ApplicationStatus {
  return status.toLowerCase().replace("_", "-") as ApplicationStatus;
}

export function statusToDb(status: ApplicationStatus, kind: ApplicationKind): string {
  const upper = status.toUpperCase().replace("-", "_");
  // The internship table's check constraint doesn't include INTERVIEW.
  if (kind === "internship" && upper === "INTERVIEW") return "UNDER_REVIEW";
  return upper;
}

export function fromInternshipRow(row: InternshipRow): AdminApplication {
  return {
    id: `internship:${row.id}`,
    kind: "internship",
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    roleLabel: row.program,
    status: statusFromDb(row.status),
    motivation: row.motivation,
    skills: row.skills,
    portfolio: row.portfolio,
    github: row.github,
    linkedin: row.linkedin,
    createdAt: row.created_at,
    education: row.education,
    fieldOfStudy: row.field_of_study,
    year: row.year,
    learningGoals: row.learning_goals,
  };
}

export function fromJobRow(row: JobRow): AdminApplication {
  return {
    id: `job:${row.id}`,
    kind: "job",
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    roleLabel: row.job_id,
    status: statusFromDb(row.status),
    motivation: row.motivation,
    skills: row.skills,
    portfolio: row.portfolio,
    github: row.github,
    linkedin: row.linkedin,
    createdAt: row.created_at,
    currentPosition: row.current_position,
    experienceLevel: row.experience_level,
    experience: row.experience,
    resumeFileName: row.resume_file_name,
  };
}

export function parseCompositeId(id: string): { kind: ApplicationKind; rawId: string } | null {
  const [kind, rawId] = id.split(":");
  if ((kind !== "internship" && kind !== "job") || !rawId) return null;
  return { kind, rawId };
}
