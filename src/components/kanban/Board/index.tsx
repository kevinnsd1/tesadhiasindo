import React, { useState, useEffect } from "react";
import { useTaskStore } from "../../../store/useTaskStore";
import Column from "../Column";
import TaskModal from "../TaskModal";
import TaskCard from "../TaskCard";
import type { Task } from "../../../types";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const Board: React.FC = () => {
  const {
    tasks,
    columns,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    searchQuery,
    filterLabel,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [targetColumnId, setTargetColumnId] = useState("todo");
  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState("");

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchLabel = filterLabel === "All" || t.label === filterLabel;
    return matchSearch && matchLabel;
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(undefined);
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Dropped over a column (empty or its droppable zone)
    if (columns.some((c) => c.id === overId)) {
      moveTask(activeId, overId);
      return;
    }

    // Dropped over another task
    const overTask = tasks.find((t) => t.id === overId);
    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask || !overTask) return;

    if (draggedTask.columnId !== overTask.columnId) {
      moveTask(activeId, overTask.columnId);
    } else {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const handleAddTask = (columnId: string) => {
    setTargetColumnId(columnId);
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (selectedTask) {
      updateTask(task);
      setToastMessage("Task updated successfully!");
    } else {
      addTask({ ...task, columnId: targetColumnId });
      setToastMessage("Task created successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="k-toast">
          <div className="k-toast-icon">✓</div>
          <span className="k-toast-message">{toastMessage}</span>
        </div>
      )}

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={filteredTasks.filter((t) => t.columnId === col.id)}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          ))}

          <div style={{ flexShrink: 0, paddingRight: 40 }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                fontWeight: 600,
                color: "#64748b",
                border: "2px dashed #e2e8f0",
                borderRadius: 16,
                padding: "12px 24px",
                background: "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                fontFamily: '"Inter", sans-serif',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#475569";
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add new List
            </button>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onClick={() => {}} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={(id) => {
          deleteTask(id);
          setIsModalOpen(false);
          setToastMessage("Task deleted");
        }}
      />
    </div>
  );
};

export default Board;
