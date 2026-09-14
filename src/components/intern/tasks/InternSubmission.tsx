"use client";

import { useState, type FormEvent } from "react";

export default function InternSubmission() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    setSubmitted(true);
    setValue("");
  };

  return (
    <section aria-labelledby="intern-submission-heading">
      <h2
        id="intern-submission-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Submission
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label htmlFor="intern-submission" className="sr-only">
          Write your progress update
        </label>
        <textarea
          id="intern-submission"
          className="task-comment-input"
          placeholder="Write your progress update…"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setSubmitted(false);
          }}
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="task-comment-submit self-end text-xs font-semibold tracking-[0.15em] uppercase"
        >
          Submit update
          <span aria-hidden>→</span>
        </button>
        {submitted && (
          <p className="text-[11px] font-medium tracking-[0.15em] text-accent uppercase">Update submitted.</p>
        )}
      </form>
    </section>
  );
}
