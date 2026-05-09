import React from "react";
import type { Column as ColumnType, Task } from "../../../types";
import TaskCard from "../TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

const IconPlus = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="k-column">
      {/* Column header */}
      <div className="k-column-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="k-column-title">{column.title}</span>
          <button
            onClick={() => onAddTask(column.id)}
            style={{
              width: 22,
              height: 22,
              border: "none",
              background: "#e2e8f0",
              borderRadius: 6,
              cursor: "pointer",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#cbd5e1")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            title="Add task"
          >
            <IconPlus />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 16,
            }}
          >
            ⋯
          </button>
        </div>

        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      {/* Droppable task list */}
      <div
        ref={setNodeRef}
        className="k-task-list"
        style={{
          background: isOver ? "rgba(59,130,246,0.03)" : "transparent",
          transition: "background 0.2s ease",
          borderRadius: 12,
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 80,
              border: "2px dashed #e2e8f0",
              borderRadius: 14,
              fontSize: 13,
              color: "#94a3b8",
              margin: "4px 2px",
            }}
          >
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
