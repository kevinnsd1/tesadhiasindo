import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Column, TaskLabel } from "../types";

interface TaskState {
  tasks: Task[];
  columns: Column[];
  searchQuery: string;
  filterLabel: TaskLabel | "All";
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, columnId: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  setSearchQuery: (q: string) => void;
  setFilterLabel: (l: TaskLabel | "All") => void;
}

const A1 = {
  id: "a1",
  name: "Alice",
  avatarUrl: "https://i.pravatar.cc/150?u=alice11",
};
const A2 = {
  id: "a2",
  name: "Bob",
  avatarUrl: "https://i.pravatar.cc/150?u=bob22",
};
const A3 = {
  id: "a3",
  name: "Carol",
  avatarUrl: "https://i.pravatar.cc/150?u=carol33",
};
const A4 = {
  id: "a4",
  name: "Dave",
  avatarUrl: "https://i.pravatar.cc/150?u=dave44",
};
const A5 = {
  id: "a5",
  name: "Eve",
  avatarUrl: "https://i.pravatar.cc/150?u=eve55",
};

const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Research for a podcast and video website",
    description: "Initial market research and competitor analysis.",
    assignees: [A1, A2],
    dueDate: "2025-08-08",
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "todo",
  },
  {
    id: "t2",
    title: "Debug checkout process for the e-commerce website",
    description: "Investigate and fix cart total calculation bug.",
    assignees: [A3, A4, A5],
    label: "Bug",
    subtasks: Array.from({ length: 19 }, (_, i) => ({
      id: `s2-${i}`,
      text: `Bug fix step ${i + 1}`,
      completed: i < 10,
    })),
    attachments: [],
    columnId: "todo",
    comments: 43,
  },
  {
    id: "t3",
    title: "Create living room furniture design",
    description: "Modern interior design concept.",
    assignees: [A1],
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "todo",
    coverImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=200&fit=crop",
  },
  {
    id: "t4",
    title: "Design wireframes for the landing page revamp",
    description: "Focus on modern aesthetics and UX best practices.",
    assignees: [A1, A2],
    dueDate: "2025-08-12",
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "doing",
    comments: 12,
  },
  {
    id: "t5",
    title: "Architecture building photography",
    description: "Capture architectural details.",
    assignees: [A3],
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "doing",
    coverImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=200&fit=crop",
  },
  {
    id: "t6",
    title: "Install and set up a marketing tool for team operations",
    description: "Evaluate and deploy analytics platform.",
    assignees: [A3, A4, A5],
    dueDate: "2025-08-14",
    label: "Undefined",
    subtasks: Array.from({ length: 20 }, (_, i) => ({
      id: `s6-${i}`,
      text: `Setup step ${i + 1}`,
      completed: i < 12,
    })),
    attachments: [],
    columnId: "doing",
    comments: 14,
  },
  {
    id: "t7",
    title: "Red building architecture",
    description: "Visual reference for brand colors.",
    assignees: [A1, A2],
    label: "Issue",
    subtasks: [],
    attachments: [],
    columnId: "review",
    coverImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=200&fit=crop",
  },
  {
    id: "t8",
    title: "Create and refine logo designs for the UI brand",
    description: "Deliver final logo variants in all required formats.",
    assignees: [A1, A2],
    label: "Issue",
    subtasks: [],
    attachments: [],
    columnId: "review",
    comments: 52,
  },
  {
    id: "t9",
    title: "Create an icon library for the project.",
    description: "Design and export a comprehensive icon set.",
    assignees: [A3, A4],
    dueDate: "2025-08-08",
    label: "Feature",
    subtasks: Array.from({ length: 18 }, (_, i) => ({
      id: `s9-${i}`,
      text: `Icon set ${i + 1}`,
      completed: i < 7,
    })),
    attachments: [],
    columnId: "review",
  },
  {
    id: "t10",
    title: "Create the Email Page layout and necessary components",
    description: "Build reusable email template components.",
    assignees: [A1, A2],
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "done",
    comments: 43,
  },
  {
    id: "t11",
    title: "Enhance website usability through user feedback",
    description: "Analyze feedback and implement UX improvements.",
    assignees: [A3, A4],
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "done",
    comments: 14,
  },
  {
    id: "t12",
    title: "Kitchen interior design project",
    description: "Modern kitchen renovation concept.",
    assignees: [A1],
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "done",
    coverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
  },
  {
    id: "t13",
    title: "Blog Edit Page Modification and Playlist Page Design",
    description: "Redesign the blog editor and add playlist feature.",
    assignees: [A1, A2],
    dueDate: "2025-08-08",
    label: "Feature",
    subtasks: Array.from({ length: 22 }, (_, i) => ({
      id: `s13-${i}`,
      text: `Task ${i + 1}`,
      completed: i < 7,
    })),
    attachments: [],
    columnId: "rework",
    comments: 40,
  },
  {
    id: "t14",
    title: "Curved building architectural study",
    description: "Research on parametric architecture.",
    assignees: [A3, A4],
    label: "Feature",
    subtasks: [],
    attachments: [],
    columnId: "rework",
    coverImage:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=200&fit=crop",
  },
  {
    id: "t15",
    title: "Plan and execute training sessions for new hires",
    description: "Onboarding plan for Q3 new team members.",
    assignees: [A3, A4],
    dueDate: "2025-08-09",
    label: "Issue",
    subtasks: Array.from({ length: 19 }, (_, i) => ({
      id: `s15-${i}`,
      text: `Training item ${i + 1}`,
      completed: i < 5,
    })),
    attachments: [],
    columnId: "rework",
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: SEED_TASKS,
      columns: [
        { id: "todo", title: "To do" },
        { id: "doing", title: "Doing" },
        { id: "review", title: "Review" },
        { id: "done", title: "Done" },
        { id: "rework", title: "Rework" },
      ],
      searchQuery: "",
      filterLabel: "All" as TaskLabel | "All",

      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      updateTask: (updated) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === updated.id ? updated : t)),
        })),
      deleteTask: (taskId) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) })),
      moveTask: (taskId, columnId) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, columnId } : t)),
        })),
      reorderTasks: (tasks) => set({ tasks }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setFilterLabel: (l) => set({ filterLabel: l }),
    }),
    { name: "kanban-v6" },
  ),
);
