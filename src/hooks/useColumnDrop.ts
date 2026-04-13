// Makes a column element a drop target for tasks, computing insert position from cursor Y.
import { useEffect, type RefObject } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Task } from "../types/board.types";
import type { Action } from "../store/boardReducer";

type DropData = {
  type?: string;
  taskId?: string;
};

export const useColumnDrop = (
  ref: RefObject<HTMLElement | null>,
  columnId: string,
  dispatch: React.Dispatch<Action>,
  setOverColumnId: (id: string | null) => void,
  allTasks: Task[],
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,

      getData: () => ({
        type: "column",
        columnId,
      }),

      onDragEnter: () => setOverColumnId(columnId),
      onDragLeave: () => setOverColumnId(null),

      onDrop: ({ source, location }) => {
        setOverColumnId(null);

        const data = source.data as DropData;

        if (data.type !== "task" || !data.taskId) return;

        const targets = location.current.dropTargets;

        const isOverCard = targets.some(
          (t) => (t.data as DropData)?.type === "task",
        );

        if (isOverCard) return;

        const columnEl = ref.current;
        if (!columnEl) return;

        // Determine which tasks are being moved (bulk if dragged task is selected).
        const draggedTask = allTasks.find((t) => t.id === data.taskId);
        const isBulk = draggedTask?.selected ?? false;
        const taskIds = isBulk
          ? allTasks.filter((t) => t.selected).map((t) => t.id)
          : [data.taskId];

        // Compute drop position from cursor Y against non-moving cards in this column.
        const cards = Array.from(
          columnEl.querySelectorAll("[data-task-id]"),
        ) as HTMLElement[];

        const movingSet = new Set(taskIds);
        const stationaryCards = cards.filter(
          (c) => !movingSet.has(c.dataset.taskId ?? ""),
        );

        const y = location.current.input.clientY;
        let position = stationaryCards.length;

        for (let i = 0; i < stationaryCards.length; i++) {
          const rect = stationaryCards[i].getBoundingClientRect();
          if (y < rect.top + rect.height / 2) {
            position = i;
            break;
          }
        }

        dispatch({
          type: "MOVE_TASKS",
          payload: { taskIds, columnId, position },
        });
      },
    });
  }, [columnId, dispatch, setOverColumnId, allTasks]);
};
