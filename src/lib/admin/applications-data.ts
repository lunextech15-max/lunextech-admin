// Internship applications — a genuinely new admin-only concept, not backed
// by any real applicant data. Applicants are labeled generically ("Candidate
// 01") rather than given invented names, consistent with this project's
// rule against fabricating people. Status changes (accept/reject/review)
// are local-state only in the UI — there is no backend yet to persist them.

import type { Application } from "./types";

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "APP-001",
    applicantLabel: "Candidate 01",
    email: "candidate01@example.com",
    phone: "+91 90000 00001",
    role: "Frontend Development",
    appliedDate: "2026-09-12",
    status: "new",
    whyJoin:
      "Interested in contributing to real production interfaces and learning how a small studio ships design-system-driven work.",
    skills: ["React", "TypeScript", "CSS"],
    portfolioUrl: "https://candidate01.example.com",
    resumeNote: "Resume attached (PDF, 210 KB).",
  },
  {
    id: "APP-002",
    applicantLabel: "Candidate 02",
    email: "candidate02@example.com",
    phone: "+91 90000 00002",
    role: "AI / Machine Learning",
    appliedDate: "2026-09-11",
    status: "new",
    whyJoin: "Looking to apply coursework in model evaluation to a real applied AI project.",
    skills: ["Python", "PyTorch", "Data Analysis"],
    resumeNote: "Resume attached (PDF, 180 KB).",
  },
  {
    id: "APP-003",
    applicantLabel: "Candidate 03",
    email: "candidate03@example.com",
    phone: "+91 90000 00003",
    role: "UI / UX Design",
    appliedDate: "2026-09-08",
    status: "under-review",
    whyJoin: "Wants hands-on experience designing within an existing brand system rather than from a blank canvas.",
    skills: ["Figma", "Design Systems", "Prototyping"],
    portfolioUrl: "https://candidate03.example.com",
    resumeNote: "Resume attached (PDF, 240 KB).",
  },
  {
    id: "APP-004",
    applicantLabel: "Candidate 04",
    email: "candidate04@example.com",
    phone: "+91 90000 00004",
    role: "Backend Development",
    appliedDate: "2026-09-07",
    status: "under-review",
    whyJoin: "Interested in API design and database work on a live multi-project backend.",
    skills: ["Node.js", "PostgreSQL", "REST APIs"],
    resumeNote: "Resume attached (PDF, 195 KB).",
  },
  {
    id: "APP-005",
    applicantLabel: "Candidate 05",
    email: "candidate05@example.com",
    phone: "+91 90000 00005",
    role: "Product Development",
    appliedDate: "2026-08-28",
    status: "accepted",
    whyJoin: "Wants exposure to how product priorities get set across several concurrent client projects.",
    skills: ["Project Management", "Roadmapping"],
    resumeNote: "Resume attached (PDF, 205 KB).",
  },
  {
    id: "APP-006",
    applicantLabel: "Candidate 06",
    email: "candidate06@example.com",
    phone: "+91 90000 00006",
    role: "Frontend Development",
    appliedDate: "2026-08-20",
    status: "rejected",
    whyJoin: "Interested in a frontend-focused internship with production React experience.",
    skills: ["React", "JavaScript"],
    resumeNote: "Resume attached (PDF, 160 KB).",
  },
];
