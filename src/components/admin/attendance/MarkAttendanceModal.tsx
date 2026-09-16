"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import { markAttendance } from "@/lib/admin/attendance-client";
import { STATUS_LABEL, type AttendanceRecord, type AttendanceStatus } from "@/lib/admin/attendance-types";

const STATUSES: AttendanceStatus[] = ["present", "late", "half-day", "absent", "leave"];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function MarkAttendanceModal({
  people,
  markedBy,
  existing,
  onClose,
  onSaved,
}: {
  people: { id: string; name: string }[];
  markedBy: string;
  existing?: AttendanceRecord;
  onClose: () => void;
  onSaved: () => void;
}) {
  const formId = useId();
  const [staffId, setStaffId] = useState(existing?.staffId ?? people[0]?.id ?? "");
  const [date, setDate] = useState(existing?.date ?? todayKey());
  const [status, setStatus] = useState<AttendanceStatus>(existing?.status ?? "present");
  const [checkIn, setCheckIn] = useState(existing?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(existing?.checkOut ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!staffId || !date) {
      setError("Person and date are required.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: saveError } = await markAttendance({
      staffId,
      date,
      status,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      notes,
      markedBy,
    });

    setPending(false);

    if (saveError) {
      setError(`Couldn't save: ${saveError}`);
      return;
    }

    onSaved();
  };

  return (
    <Modal title={existing ? "Correct attendance." : "Mark attendance."} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="staff-field-label" htmlFor={`${formId}-person`}>
            Person
          </label>
          <select
            id={`${formId}-person`}
            className="admin-select mt-2"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            disabled={Boolean(existing)}
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-date`}>
              Date
            </label>
            <input
              id={`${formId}-date`}
              type="date"
              className="admin-input mt-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={Boolean(existing)}
              required
            />
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-status`}>
              Status
            </label>
            <select
              id={`${formId}-status`}
              className="admin-select mt-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-checkin`}>
              Check-in
            </label>
            <input
              id={`${formId}-checkin`}
              type="time"
              className="admin-input mt-2"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-checkout`}>
              Check-out
            </label>
            <input
              id={`${formId}-checkout`}
              type="time"
              className="admin-input mt-2"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${formId}-notes`}>
            Notes (optional)
          </label>
          <input
            id={`${formId}-notes`}
            className="admin-input mt-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for correction, leave type, etc."
          />
        </div>

        {error && (
          <p role="alert" className="staff-error">
            {error}
          </p>
        )}

        <div className="mt-2 flex items-center gap-6">
          <button
            type="submit"
            disabled={pending}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase disabled:opacity-50"
          >
            {pending ? "Saving…" : existing ? "Save correction" : "Mark attendance"}
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
