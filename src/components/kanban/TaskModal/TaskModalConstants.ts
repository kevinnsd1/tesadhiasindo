import type { Assignee, TaskLabel } from "../../../types";

export const LABELS: TaskLabel[] = ["Feature", "Bug", "Issue", "Undefined"];

export const DUMMY_USERS: Assignee[] = [
  {
    id: "a1",
    name: "Alice",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "a2",
    name: "Bob",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
  {
    id: "a3",
    name: "Carol",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  },
  {
    id: "a4",
    name: "Dave",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
  },
];
