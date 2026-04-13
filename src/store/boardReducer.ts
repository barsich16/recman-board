// Central reducer managing all board mutations (columns and tasks).
import type { BoardColumn, Task } from "../types/board.types";

export type State = {
  columns: BoardColumn[];
  tasks: Task[];
};

export type Action =
  | { type: "SET_DATA"; payload: State }
  | { type: "ADD_COLUMN"; payload: { title: string; color: string } }
  | { type: "DELETE_COLUMN"; payload: { columnId: string } }
  | { type: "RENAME_COLUMN"; payload: { columnId: string; title: string } }
  | { type: "MOVE_COLUMN"; payload: { fromId: string; toId: string } }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: { taskId: string } }
  | { type: "TOGGLE_TASK"; payload: { taskId: string } }
  | { type: "UPDATE_TASK"; payload: { taskId: string; title: string } }
  | {
      type: "MOVE_TASK";
      payload: { taskId: string; columnId: string; position: number };
    }
  | {
      type: "MOVE_TASKS";
      payload: { taskIds: string[]; columnId: string; position: number };
    }
  | { type: "TOGGLE_ALL"; payload: { columnId: string } };

export const boardReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DATA":
      return action.payload;

    case "ADD_COLUMN":
      return {
        ...state,
        columns: [
          ...state.columns,
          {
            id: Date.now().toString(),
            title: action.payload.title,
            color: action.payload.color,
          },
        ],
      };

    case "DELETE_COLUMN":
      return {
        ...state,
        columns: state.columns.filter((c) => c.id !== action.payload.columnId),
        tasks: state.tasks.filter(
          (t) => t.columnId !== action.payload.columnId,
        ),
      };

    case "RENAME_COLUMN":
      return {
        ...state,
        columns: state.columns.map((c) =>
          c.id === action.payload.columnId
            ? { ...c, title: action.payload.title }
            : c,
        ),
      };

    case "MOVE_COLUMN": {
      const fromIndex = state.columns.findIndex(
        (c) => c.id === action.payload.fromId,
      );
      const toIndex = state.columns.findIndex(
        (c) => c.id === action.payload.toId,
      );

      const updated = [...state.columns];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      return { ...state, columns: updated };
    }

    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload.taskId),
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.payload.taskId) return t;

          const completed = !t.completed;

          return {
            ...t,
            completed,
            completedAt: completed ? Date.now() : undefined,
          };
        }),
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId
            ? { ...t, title: action.payload.title }
            : t,
        ),
      };

    case "MOVE_TASK": {
      const { taskId, columnId, position } = action.payload;

      const movingTask = state.tasks.find((t) => t.id === taskId);
      if (!movingTask) return state;

      const tasksWithoutMoving = state.tasks.filter((t) => t.id !== taskId);

      // Split into target-column tasks (to reorder) and everything else.
      const targetColumnTasks = tasksWithoutMoving.filter(
        (t) => t.columnId === columnId,
      );
      const otherColumnTasks = tasksWithoutMoving.filter(
        (t) => t.columnId !== columnId,
      );

      const updatedTask = { ...movingTask, columnId };
      targetColumnTasks.splice(position, 0, updatedTask);

      return {
        ...state,
        tasks: [...otherColumnTasks, ...targetColumnTasks],
      };
    }

    case "MOVE_TASKS": {
      const { taskIds, columnId, position } = action.payload;

      // Preserve original relative order; move all tasks to the new column and deselect.
      const movingTasks = state.tasks
        .filter((t) => taskIds.includes(t.id))
        .map((t) => ({ ...t, columnId, selected: false }));

      if (movingTasks.length === 0) return state;

      const remaining = state.tasks.filter((t) => !taskIds.includes(t.id));
      const targetColumnTasks = remaining.filter((t) => t.columnId === columnId);
      const otherColumnTasks = remaining.filter((t) => t.columnId !== columnId);

      targetColumnTasks.splice(position, 0, ...movingTasks);

      return {
        ...state,
        tasks: [...otherColumnTasks, ...targetColumnTasks],
      };
    }

    case "TOGGLE_ALL": {
      const columnTasks = state.tasks.filter(
        (t) => t.columnId === action.payload.columnId,
      );

      const allSelected =
        columnTasks.length > 0 && columnTasks.every((t) => t.selected);

      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.columnId === action.payload.columnId
            ? { ...t, selected: !allSelected }
            : t,
        ),
      };
    }

    default:
      return state;
  }
};
