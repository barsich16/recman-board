import type { Task } from "../types/board.types";

export const deleteSelectedTasks = (tasks: Task[]) => {
  return tasks.filter(t => !t.selected);
};

export const completeSelectedTasks = (tasks: Task[]) => {
  return tasks.map(t =>
    t.selected
      ? { ...t, completed: true, completedAt: Date.now(), selected: false }
      : t
  );
};

export const uncompleteSelectedTasks = (tasks: Task[]) => {
  return tasks.map(t =>
    t.selected
      ? { ...t, completed: false, completedAt: undefined, selected: false }
      : t
  );
};