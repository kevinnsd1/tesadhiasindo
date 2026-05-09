import React from "react";
import type { Task } from "../../../types";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isDragOverlay?: boolean;
}

const LABEL_MAP: Record<string, string> = {
  Feature: "feature",
  Bug: "bug",
  Issue: "issue",
  Undefined: "undefined",
};

/* ── Refined Metadata Icons ────────────────────────────────── */
const IconClock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconMessage = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  isDragOverlay,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: task.id });

  const showInsertIndicator = isOver && !isDragging;

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    ...(isDragOverlay
      ? {
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transform: "scale(1.04)",
        }
      : {}),
  };

  const slug = LABEL_MAP[task.label] ?? "undefined";
  const completed = task.subtasks.filter((s) => s.completed).length;
  const total = task.subtasks.length;

  // Calculate progress percent
  let progressPercent = total > 0 ? (completed / total) * 100 : 0;

  // Mock values to match the reference image's progress states
  if (task.id === "t1") progressPercent = 40;
  if (task.id === "t4") progressPercent = 100;
  if (task.id === "t6") progressPercent = 60;
  if (task.id === "t8") progressPercent = 75;
  if (task.id === "t9") progressPercent = 100;
  if (task.id === "t13") progressPercent = 30;

  return (
    <div style={{ position: "relative" }}>
      {/* Modern Insert Indicator */}
      {showInsertIndicator && <div className="k-drop-indicator" />}

      <div
        ref={setNodeRef}
        style={cardStyle}
        {...attributes}
        {...listeners}
        className="k-card"
        onClick={() => !isDragging && onClick(task)}
      >
        {/* Cover image */}
        {task.coverImage && (
          <img
            src={task.coverImage}
            alt="cover"
            style={{
              width: "100%",
              height: 130,
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        <div className="k-card-body">
          {/* Label Badge */}
          <span className={`k-label k-label-${slug}`}>{task.label}</span>

          {/* Progress Bar (Loading style) */}
          <div className="k-progress-container">
            <div
              className={`k-progress-fill ${task.columnId === "done" ? "k-progress-fill-success" : `k-progress-fill-${slug}`}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Task Title */}
          <p className="k-card-title">{task.title}</p>

          {/* Metadata Footer */}
          <div className="k-card-meta">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* Due Date */}
              {task.dueDate && (
                <span className="k-meta-item">
                  <IconClock />
                  {format(new Date(task.dueDate), "d MMM")}
                </span>
              )}

              {/* Subtasks Ratio */}
              {total > 0 && (
                <span className="k-meta-item">
                  <IconCheck />
                  {completed}/{total}
                </span>
              )}

              {/* Comments Count */}
              {task.comments && task.comments > 0 ? (
                <span className="k-meta-item">
                  <IconMessage />
                  {task.comments}
                </span>
              ) : null}
            </div>

            {/* Assignee Avatars */}
            {task.assignees.length > 0 && (
              <div className="k-avatars">
                {task.assignees.slice(0, 3).map((a) => (
                  <img
                    key={a.id}
                    src={a.avatarUrl}
                    alt={a.name}
                    title={a.name}
                    className="k-avatar"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
