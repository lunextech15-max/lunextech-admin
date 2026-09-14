"use client";

import { useState, type FormEvent } from "react";

export default function CommentInput({ onSubmit }: { onSubmit: (body: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      <label htmlFor="task-comment" className="sr-only">
        Write a comment
      </label>
      <textarea
        id="task-comment"
        className="task-comment-input"
        placeholder="Write a comment…"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="task-comment-submit self-end text-xs font-semibold tracking-[0.15em] uppercase"
      >
        Send
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
