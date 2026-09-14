import type { TaskPriority as TaskPriorityValue } from "@/lib/staff/types";

const PRIORITY_LABEL: Record<TaskPriorityValue, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function TaskPriority({ priority }: { priority: TaskPriorityValue }) {
  return <span className={`task-priority task-priority--${priority}`}>{PRIORITY_LABEL[priority]}</span>;
}
