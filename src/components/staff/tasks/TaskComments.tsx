import CommentInput from "./CommentInput";
import type { TaskComment } from "@/lib/staff/types";

export default function TaskComments({
  comments,
  onAddComment,
  title = "05 / Comments",
}: {
  comments: TaskComment[];
  onAddComment: (body: string) => void;
  title?: string;
}) {
  return (
    <section aria-labelledby="task-comments-heading">
      <h2
        id="task-comments-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        {title}
      </h2>

      {comments.length > 0 ? (
        <div className="mt-4">
          {comments.map((comment) => (
            <div key={comment.id} className="task-comment">
              <p className="text-xs font-semibold tracking-[0.1em] text-soft-white uppercase">{comment.author}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-soft-white/65">{comment.body}</p>
              <p className="mt-1.5 text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
                {comment.relativeTime}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-soft-white/45">No comments yet.</p>
      )}

      <CommentInput onSubmit={onAddComment} />
    </section>
  );
}
