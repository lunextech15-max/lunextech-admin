"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminTaskMeta({ taskTitle }: { taskTitle: string }) {
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border border-line p-5">
      <span className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase" aria-disabled="true">
        Change assignee
      </span>
      <span className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase" aria-disabled="true">
        Change priority
      </span>
      <span className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase" aria-disabled="true">
        Change due date
      </span>
      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        className="dash-quick-action admin-danger text-xs font-medium tracking-[0.15em] uppercase"
      >
        Delete task
      </button>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete task?"
          description={`"${taskTitle}" will be removed from this session's task list. This can't be undone here.`}
          confirmLabel="Delete"
          onConfirm={() => router.push("/admin/tasks")}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
