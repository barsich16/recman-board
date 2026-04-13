// Registers a card element as a draggable task, toggling the dragging CSS class.
import { useEffect, type RefObject } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export const useDraggableTask = (
  ref: RefObject<HTMLElement | null>,
  taskId: string,
  columnId: string,
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,

      getInitialData: () => ({
        type: "task",
        taskId,
        columnId,
      }),

      onDragStart: ({ source }) => {
        const el = source.element as HTMLElement;
        el.classList.add("card--dragging");
      },

      onDrop: ({ source }) => {
        const el = source.element as HTMLElement;
        el.classList.remove("card--dragging");
      },
    });
  }, [taskId, columnId]);
};