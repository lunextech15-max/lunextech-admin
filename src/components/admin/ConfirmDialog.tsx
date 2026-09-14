"use client";

import Modal from "./Modal";

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  danger = true,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="max-w-sm text-sm leading-relaxed text-soft-white/60">{description}</p>
      <div className="mt-7 flex items-center gap-6">
        <button
          type="button"
          onClick={onConfirm}
          className={`task-action text-xs font-semibold tracking-[0.15em] uppercase ${danger ? "admin-danger" : "text-soft-white"}`}
        >
          {confirmLabel}
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
    </Modal>
  );
}
