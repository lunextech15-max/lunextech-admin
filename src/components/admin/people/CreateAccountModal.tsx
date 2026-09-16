"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import { createStaffProfile } from "@/lib/admin/team-client";
import type { AccountRole } from "@/lib/admin/types";

type Step = "type" | "form" | "created";

export type CreatedAccount = {
  lunexId: string;
  name: string;
  email: string;
  role: AccountRole;
  title: string;
  department: string;
  supervisorName?: string;
  internshipStart?: string;
  internshipEnd?: string;
};

const STAFF_ROLES = ["Staff Member", "Project Manager", "Developer", "Designer", "Other"];
const DEPARTMENTS = ["Product Development", "Design", "Engineering", "Operations", "Management"];
const INTERNSHIP_ROLES = [
  "Frontend Development",
  "Backend Development",
  "UI / UX Design",
  "AI / Machine Learning",
  "Product Development",
];

export default function CreateAccountModal({
  nextStaffId,
  nextInternId,
  supervisors,
  initialType = "staff",
  initialName = "",
  initialEmail = "",
  onClose,
  onCreated,
}: {
  nextStaffId: string;
  nextInternId: string;
  supervisors: { lunexId: string; name: string }[];
  initialType?: AccountRole;
  initialName?: string;
  initialEmail?: string;
  onClose: () => void;
  onCreated: (account: CreatedAccount) => void;
}) {
  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<AccountRole>(initialType);
  const [created, setCreated] = useState<CreatedAccount | null>(null);
  const nameId = useId();

  const handleCreated = (account: CreatedAccount) => {
    setCreated(account);
    setStep("created");
    onCreated(account);
  };

  if (step === "created" && created) {
    return (
      <Modal title="Profile saved." onClose={onClose}>
        <p className="max-w-sm text-sm leading-relaxed text-soft-white/55">
          {created.name}&apos;s profile is now in the roster. To let them sign in, create their login in Supabase
          Dashboard → Authentication → Users with the email below, then they can use this Staff ID to log in — this
          app has no service-role key, so it can&apos;t create logins itself.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-5 border border-line p-5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Name</p>
            <p className="mt-1.5 text-sm font-medium text-soft-white">{created.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Lunex ID</p>
            <p className="mt-1.5 text-sm font-medium text-soft-white">{created.lunexId}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Email</p>
            <p className="mt-1.5 text-sm font-medium text-soft-white">{created.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Role</p>
            <p className="mt-1.5 text-sm font-medium text-soft-white uppercase">{created.role}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onClose}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            Done
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
        </div>
      </Modal>
    );
  }

  if (step === "form") {
    return (
      <Modal title={type === "staff" ? "Create account." : "Create intern account."} onClose={onClose}>
        <AccountForm
          type={type}
          nameId={nameId}
          lunexId={type === "staff" ? nextStaffId : nextInternId}
          supervisors={supervisors}
          staffRoles={STAFF_ROLES}
          departments={DEPARTMENTS}
          internshipRoles={INTERNSHIP_ROLES}
          initialName={initialName}
          initialEmail={initialEmail}
          onCancel={() => setStep("type")}
          onCreated={handleCreated}
        />
      </Modal>
    );
  }

  return (
    <Modal title="Create account." onClose={onClose}>
      <p id="account-type-label" className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
        Account type
      </p>
      <div role="radiogroup" aria-labelledby="account-type-label" className="mt-3 flex gap-3">
        <button
          type="button"
          role="radio"
          aria-checked={type === "staff"}
          onClick={() => setType("staff")}
          className={`admin-type-option ${type === "staff" ? "is-active" : ""}`}
        >
          Staff
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={type === "intern"}
          onClick={() => setType("intern")}
          className={`admin-type-option ${type === "intern" ? "is-active" : ""}`}
        >
          Intern
        </button>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setStep("form")}
          className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          Continue
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

function AccountForm({
  type,
  nameId,
  lunexId,
  supervisors,
  staffRoles,
  departments,
  internshipRoles,
  initialName,
  initialEmail,
  onCancel,
  onCreated,
}: {
  type: AccountRole;
  nameId: string;
  lunexId: string;
  supervisors: { lunexId: string; name: string }[];
  staffRoles: string[];
  departments: string[];
  internshipRoles: string[];
  initialName: string;
  initialEmail: string;
  onCancel: () => void;
  onCreated: (account: CreatedAccount) => void;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [staffRole, setStaffRole] = useState(staffRoles[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [internshipRole, setInternshipRole] = useState(internshipRoles[0]);
  const [supervisorId, setSupervisorId] = useState(supervisors[0]?.lunexId ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Fill in all required fields.");
      return;
    }
    if (type === "intern" && (!startDate || !endDate)) {
      setError("Start and end dates are required for an intern.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: createError } = await createStaffProfile({
      staffId: lunexId,
      fullName: name.trim(),
      email: email.trim(),
      role: type,
      title: type === "staff" ? staffRole : undefined,
      department: type === "staff" ? department : undefined,
      internshipRole: type === "intern" ? internshipRole : undefined,
      supervisorStaffId: type === "intern" ? supervisorId || undefined : undefined,
      internshipStart: type === "intern" ? startDate : undefined,
      internshipEnd: type === "intern" ? endDate : undefined,
    });

    setPending(false);

    if (createError) {
      console.error("CreateAccountModal: createStaffProfile failed", createError);
      setError(`Couldn't save this profile: ${createError}`);
      return;
    }

    onCreated({
      lunexId,
      name: name.trim(),
      email: email.trim(),
      role: type,
      title: type === "staff" ? staffRole : `${internshipRole} Intern`,
      department: type === "staff" ? department : internshipRole,
      supervisorName: type === "intern" ? supervisors.find((s) => s.lunexId === supervisorId)?.name : undefined,
      internshipStart: type === "intern" ? startDate : undefined,
      internshipEnd: type === "intern" ? endDate : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor={nameId} className="staff-field-label">
          Full name
        </label>
        <input
          id={nameId}
          className="admin-input mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <p className="staff-field-label">Lunex ID</p>
        <p className="admin-input mt-2 text-soft-white/50">{lunexId}</p>
      </div>

      <div>
        <label className="staff-field-label" htmlFor={`${nameId}-email`}>
          Email
        </label>
        <input
          id={`${nameId}-email`}
          type="email"
          className="admin-input mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {type === "staff" ? (
        <>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-role`}>
              Role
            </label>
            <select
              id={`${nameId}-role`}
              className="admin-select mt-2"
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
            >
              {staffRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-dept`}>
              Department
            </label>
            <select
              id={`${nameId}-dept`}
              className="admin-select mt-2"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-role`}>
              Internship role
            </label>
            <select
              id={`${nameId}-role`}
              className="admin-select mt-2"
              value={internshipRole}
              onChange={(e) => setInternshipRole(e.target.value)}
            >
              {internshipRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="staff-field-label" htmlFor={`${nameId}-start`}>
                Start date
              </label>
              <input
                id={`${nameId}-start`}
                type="date"
                className="admin-input mt-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="staff-field-label" htmlFor={`${nameId}-end`}>
                End date
              </label>
              <input
                id={`${nameId}-end`}
                type="date"
                className="admin-input mt-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-supervisor`}>
              Assigned supervisor
            </label>
            {supervisors.length > 0 ? (
              <select
                id={`${nameId}-supervisor`}
                className="admin-select mt-2"
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
              >
                {supervisors.map((s) => (
                  <option key={s.lunexId} value={s.lunexId}>
                    {s.name} ({s.lunexId})
                  </option>
                ))}
              </select>
            ) : (
              <p className="admin-input mt-2 text-soft-white/40">No staff accounts yet to assign as a supervisor.</p>
            )}
          </div>
        </>
      )}

      <div>
        <p className="staff-field-label">Account status</p>
        <span className="dash-status dash-status--completed mt-2">Active</span>
      </div>

      {error && <p className="staff-error">{error}</p>}

      <div className="mt-2 flex items-center gap-6">
        <button
          type="submit"
          disabled={pending}
          className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase disabled:opacity-50"
        >
          {pending ? "Saving…" : type === "staff" ? "Create staff account" : "Create intern account"}
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
