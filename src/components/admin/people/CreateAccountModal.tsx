"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import type { AccountRole } from "@/lib/admin/types";

type Step = "type" | "form" | "created";

type CreatedAccount = {
  lunexId: string;
  name: string;
  role: AccountRole;
  tempPassword: string;
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

function generateTempPassword() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

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
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const nameId = useId();

  const handleCreate = (name: string) => {
    const lunexId = type === "staff" ? nextStaffId : nextInternId;
    const account: CreatedAccount = {
      lunexId,
      name,
      role: type,
      tempPassword: generateTempPassword(),
    };
    setCreated(account);
    setStep("created");
    onCreated(account);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label} copied.`);
    } catch {
      setCopyStatus("Couldn't copy — copy it manually.");
    }
  };

  if (step === "created" && created) {
    return (
      <Modal title="Account created." onClose={onClose}>
        <p className="max-w-sm text-sm leading-relaxed text-soft-white/55">
          Give this Lunex ID and temporary password to {created.name} — they&apos;ll use it to sign in for the first
          time. This is not stored anywhere yet; there is no backend connected.
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
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Role</p>
            <p className="mt-1.5 text-sm font-medium text-soft-white uppercase">{created.role}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              Temporary password
            </p>
            <p className="mt-1.5 text-sm font-medium text-soft-white">{created.tempPassword}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-6">
          <button
            type="button"
            onClick={() => copy(created.lunexId, "Lunex ID")}
            className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
          >
            Copy Lunex ID
          </button>
          <button
            type="button"
            onClick={() => copy(`Lunex ID: ${created.lunexId}\nPassword: ${created.tempPassword}`, "Credentials")}
            className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
          >
            Copy credentials
          </button>
        </div>
        {copyStatus && <p className="mt-3 text-[11px] text-accent uppercase tracking-[0.1em]">{copyStatus}</p>}

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
          onSubmit={handleCreate}
        />
      </Modal>
    );
  }

  return (
    <Modal title="Create account." onClose={onClose}>
      <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Account type</p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={() => setType("staff")}
          className={`admin-type-option ${type === "staff" ? "is-active" : ""}`}
        >
          Staff
        </button>
        <button
          type="button"
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
  onSubmit,
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
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    onSubmit(name.trim());
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
            <select id={`${nameId}-role`} className="admin-select mt-2" defaultValue={staffRoles[0]}>
              {staffRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-dept`}>
              Department
            </label>
            <select id={`${nameId}-dept`} className="admin-select mt-2" defaultValue={departments[0]}>
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
            <select id={`${nameId}-role`} className="admin-select mt-2" defaultValue={internshipRoles[0]}>
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
              <input id={`${nameId}-start`} type="date" className="admin-input mt-2" />
            </div>
            <div>
              <label className="staff-field-label" htmlFor={`${nameId}-end`}>
                End date
              </label>
              <input id={`${nameId}-end`} type="date" className="admin-input mt-2" />
            </div>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-supervisor`}>
              Assigned supervisor
            </label>
            <select id={`${nameId}-supervisor`} className="admin-select mt-2">
              {supervisors.map((s) => (
                <option key={s.lunexId} value={s.lunexId}>
                  {s.name} ({s.lunexId})
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-password`}>
            Password
          </label>
          <input
            id={`${nameId}-password`}
            type="password"
            className="admin-input mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-confirm`}>
            Confirm password
          </label>
          <input
            id={`${nameId}-confirm`}
            type="password"
            className="admin-input mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <p className="staff-field-label">Account status</p>
        <span className="dash-status dash-status--completed mt-2">Active</span>
      </div>

      {error && <p className="staff-error">{error}</p>}

      <div className="mt-2 flex items-center gap-6">
        <button
          type="submit"
          className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          {type === "staff" ? "Create staff account" : "Create intern account"}
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
