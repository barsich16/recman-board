// Makes a card element a drop target for other tasks, handling top/bottom edge detection.
import { useEffect, type RefObject } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Task } from "../types/board.types";
import type { Action } from "../store/boardReducer";

export const useTaskDrop = (
  ref: RefObject<HTMLElement | null>,
  task: Task,
  dispatch: React.Dispatch<Action>,
  tasks: Task[],
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,

      getData: () => ({
        type: "task",
        taskId: task.id,
        columnId: task.columnId,
      }),

      onDrag: ({ location }) => {
        const rect = el.getBoundingClientRect();
        const y = location.current.input.clientY;
        el.dataset.edge = y > rect.top + rect.height / 2 ? "bottom" : "top";
      },

      onDragLeave: () => {
        delete el.dataset.edge;
      },

      onDrop: ({ source, location }) => {
        delete el.dataset.edge;

        const data = source.data as {
          type: string;
          taskId: string;
        };

        if (data.type !== "task" || data.taskId === task.id) return;

        const rect = el.getBoundingClientRect();
        const y = location.current.input.clientY;
        const isBottom = y > rect.top + rect.height / 2;

        // Determine which tasks are being moved (bulk if dragged task is selected).
        const draggedTask = tasks.find((t) => t.id === data.taskId);
        const isBulk = draggedTask?.selected ?? false;
        const taskIds = isBulk
          ? tasks.filter((t) => t.selected).map((t) => t.id)
          : [data.taskId];

        // Skip if the drop target card is itself being moved.
        if (taskIds.includes(task.id)) return;

        // Calculate position relative to non-moving tasks in the target column.
        const stationaryInColumn = tasks.filter(
          (t) => t.columnId === task.columnId && !taskIds.includes(t.id),
        );
        const targetIndex = stationaryInColumn.findIndex((t) => t.id === task.id);
        const insertIndex = isBottom ? targetIndex + 1 : targetIndex;

        dispatch({
          type: "MOVE_TASKS",
          payload: {
            taskIds,
            columnId: task.columnId,
            position: insertIndex,
          },
        });
      },
    });
  }, [task, dispatch, tasks]);
};
