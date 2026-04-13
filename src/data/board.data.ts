import type { BoardColumn, Task } from "../types/board.types";

export const columns: BoardColumn[] = [
  { id: "todo", title: "Todo" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
  { id: "backlog", title: "Backlog" },
];

export const tasks: Task[] = [
  {
    id: "1",
    title: "Update API documentation and add usage examples",
    columnId: "todo",
    tags: ["Change Request"],
    completed: false,
    createdAt: Date.now() - 1000000,
  },
  {
    id: "2",
    title: "Implement Landing Page",
    columnId: "todo",
    tags: ["Enhancement"],
    completed: false,
    createdAt: Date.now() - 1000000,
  },
  {
    id: "3",
    title: "Landing Page hero block",
    columnId: "progress",
    tags: ["Design"],
    completed: false,
    createdAt: Date.now() - 1000000,
  },
  {
    id: "4",
    title: "Landing Page footer",
    columnId: "progress",
    tags: ["Design"],
    completed: false,
    createdAt: Date.now() - 1000000,
  },
  {
    id: "5",
    title: "Registration view form",
    columnId: "done",
    tags: ["Enhancement"],
    completed: false,
    createdAt: Date.now() - 1000000,
  },
  {
    id: "6",
    title: "Email verification",
    columnId: "backlog",
    tags: ["Bug"],
    completed: false,
    createdAt: Date.now() - 1000000,
  },
];

export const tagColors: Record<string, string> = {
  "Change Request": "#323376",
  Enhancement: "#21ba59",
  Design: "#d295daf2",
  Bug: "#ef4444",
};
