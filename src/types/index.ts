export type TaskLabel = "Feature" | "Bug" | "Issue" | "Undefined";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignees: Assignee[];
  dueDate?: string;
  label: TaskLabel;
  priority?: TaskPriority;
  subtasks: Subtask[];
  attachments: Attachment[];
  columnId: string;
  coverImage?: string;
  comments?: number;
}

export interface Column {
  id: string;
  title: string;
}
