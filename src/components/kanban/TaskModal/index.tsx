import React, { useState, useEffect } from "react";
import { IonModal } from "@ionic/react";
import type { Task, Subtask, TaskLabel, Assignee } from "../../../types";
import { Icons } from "./components/TaskModalIcons";
import { LABELS, DUMMY_USERS } from "./TaskModalConstants";
import {
  SectionLabel,
  CustomSelect,
  CustomDatePicker,
} from "./components/TaskModalComponents";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  task?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
}) => {
  // ── State ──
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    label: "Undefined" as TaskLabel,
    dueDate: "",
    subtasks: [] as Subtask[],
    assignees: [] as Assignee[],
    coverImage: "",
  });
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // ── Effects ──
  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title,
        description: task.description,
        label: task.label,
        dueDate: task.dueDate ?? "",
        subtasks: task.subtasks,
        assignees: task.assignees,
        coverImage: task.coverImage ?? "",
      });
    } else if (!task && isOpen) {
      setFormData({
        title: "",
        description: "",
        label: "Undefined",
        dueDate: "",
        subtasks: [],
        assignees: [],
        coverImage: "",
      });
    }
  }, [task, isOpen]);

  // ── Handlers ──
  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const finalTitle =
      formData.title.trim() || (task ? task.title : "Untitled Task");
    onSave({
      ...formData,
      id: task?.id ?? Math.random().toString(36).substring(2, 9),
      title: finalTitle,
      attachments: task?.attachments ?? [],
      assignees:
        formData.assignees.length > 0 ? formData.assignees : [DUMMY_USERS[0]],
      columnId: task?.columnId ?? "todo",
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newSub: Subtask = {
      id: Date.now().toString(),
      text: newSubtaskText.trim(),
      completed: false,
    };
    updateField("subtasks", [...formData.subtasks, newSub]);
    setNewSubtaskText("");
  };

  const toggleSubtask = (id: string) => {
    updateField(
      "subtasks",
      formData.subtasks.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s,
      ),
    );
  };

  const handleAddAssignee = () => {
    const unassigned = DUMMY_USERS.find(
      (u) => !formData.assignees.some((a) => a.id === u.id),
    );
    const nextUser = unassigned || {
      ...DUMMY_USERS[0],
      id: Date.now().toString(),
    };
    updateField("assignees", [...formData.assignees, nextUser]);
  };

  // ── Derived ──
  const completedCount = formData.subtasks.filter((s) => s.completed).length;
  const progress =
    formData.subtasks.length > 0
      ? completedCount / formData.subtasks.length
      : 0;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="task-modal-root"
    >
      <div className="flex flex-col h-full bg-white font-sans text-slate-800 antialiased">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold transition-all text-slate-700"
          >
            <span className="text-blue-500">
              <Icons.Check />
            </span>{" "}
            Mark Complete
          </button>
          <div className="flex items-center gap-2">
            {task && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all text-slate-400 group"
                title="Delete Task"
              >
                <Icons.Trash />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
            >
              <Icons.Close />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pt-8 pb-12">
          <div className="max-w-5xl mx-auto grid grid-cols-12 gap-12">
            {/* Left Panel */}
            <div className="col-span-7 space-y-8">
              {/* Cover Image */}
              <div
                className="group relative w-full h-52 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                onClick={() =>
                  updateField(
                    "coverImage",
                    `https://picsum.photos/seed/${Date.now()}/800/400`,
                  )
                }
              >
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
                    className="w-full h-full object-cover"
                    alt="cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Icons.Image />
                    <span className="text-sm font-semibold text-slate-400">
                      Add Cover Image
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Task title..."
                  className="text-4xl font-extrabold bg-transparent border-none outline-none flex-1 placeholder:text-slate-200 text-slate-900"
                />
                <div className="text-slate-300">
                  <Icons.Edit />
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                {/* Assignees */}
                <div>
                  <SectionLabel>Assignee</SectionLabel>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {formData.assignees.map((a) => (
                        <img
                          key={a.id}
                          src={a.avatarUrl}
                          className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                          alt="avatar"
                        />
                      ))}
                      {formData.assignees.length > 3 && (
                        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                          +2
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleAddAssignee}
                      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
                    >
                      <Icons.Plus s={18} />
                    </button>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <SectionLabel>Due Date</SectionLabel>
                  <CustomDatePicker
                    value={formData.dueDate}
                    onChange={(val) => updateField("dueDate", val)}
                    icon={<Icons.Calendar />}
                  />
                </div>

                <div>
                  <SectionLabel>Board</SectionLabel>
                  <CustomSelect
                    value="Northern Light"
                    options={["Northern Light", "Other Board"]}
                    onChange={() => {}}
                    icon={<Icons.ChevronDown />}
                  />
                </div>

                <div>
                  <SectionLabel>Column</SectionLabel>
                  <CustomSelect
                    value="To Do"
                    options={["To Do", "In Progress", "Done"]}
                    onChange={() => {}}
                    icon={<Icons.ChevronDown />}
                  />
                </div>

                <div>
                  <SectionLabel>Label</SectionLabel>
                  <CustomSelect
                    value={formData.label}
                    options={LABELS}
                    onChange={(val) => updateField("label", val)}
                    icon={<Icons.ChevronDown />}
                  />
                </div>

                <div>
                  <SectionLabel>Priority</SectionLabel>
                  <CustomSelect
                    value="Medium"
                    options={["Low", "Medium", "High"]}
                    onChange={() => {}}
                    icon={<Icons.ChevronDown />}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <SectionLabel mb="mb-4" size="text-lg text-slate-800">
                  Description
                </SectionLabel>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Add detailed description..."
                    rows={5}
                    className="w-full bg-slate-100/80 rounded-2xl p-7 text-sm font-medium text-slate-600 outline-none resize-none placeholder:text-slate-400 pl-14"
                  />
                  <div className="absolute left-7 top-7 text-slate-400">
                    <Icons.Edit />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel (Sidebar) */}
            <div className="col-span-5 border-l border-slate-100 pl-12 space-y-12">
              {/* Attachments */}
              <div>
                <SectionLabel size="text-lg text-slate-800" mb="mb-4">
                  Attachments
                </SectionLabel>
                <div className="w-full py-10 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <Icons.Upload />
                  <span className="text-[11px] font-bold text-slate-400 text-center px-4">
                    Drag & Drop files here or{" "}
                    <span className="text-blue-500">browse device</span>
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel size="text-lg text-slate-800" mb="mb-0">
                    Check List
                  </SectionLabel>
                  <span className="text-[11px] font-black text-slate-300">
                    {completedCount}/{formData.subtasks.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                <div className="space-y-5 mb-8">
                  {formData.subtasks.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 group animate-in fade-in slide-in-from-left-2"
                    >
                      <input
                        type="checkbox"
                        checked={s.completed}
                        onChange={() => toggleSubtask(s.id)}
                        className="w-6 h-6 rounded-lg border-2 border-slate-200 accent-blue-500 cursor-pointer shadow-sm"
                      />
                      <span
                        className={`text-sm font-bold flex-1 ${s.completed ? "text-slate-300 line-through" : "text-slate-600"}`}
                      >
                        {s.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddSubtask}
                    className="w-full bg-slate-100/50 hover:bg-slate-100 text-slate-500 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Plus s={14} /> Add subtask
                  </button>
                  <input
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleAddSubtask()}
                    placeholder="Type and press Enter..."
                    className="w-full bg-transparent border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:border-blue-200 transition-all"
                  />
                </div>
              </div>

              {/* Activity */}
              <div>
                <SectionLabel size="text-lg text-slate-800" mb="mb-4">
                  Activity
                </SectionLabel>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium italic">
                    No recent activity detected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-10 py-6 border-t border-slate-50 flex items-center justify-end gap-4 bg-white">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black rounded-2xl text-xs transition-all tracking-wider"
          >
            DISCARD
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs transition-all shadow-xl shadow-blue-100 tracking-wider"
          >
            SAVE TASK
          </button>
        </footer>
      </div>
    </IonModal>
  );
};

export default TaskModal;
