// Registers a column element as draggable, applying a subtle visual feedback during drag.
import { useEffect, type RefObject } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export const useDraggableColumn = (
  ref: RefObject<HTMLElement | null>,
  columnId: string
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,

      getInitialData: () => ({
        type: "column",
        columnId,
      }),

      onGenerateDragPreview: ({ source }) => {
        const el = source.element as HTMLElement;
        el.style.opacity = "0.4";
        el.style.transform = "scale(0.98)";
      },

      onDrop: ({ source }) => {
        const el = source.element as HTMLElement;
        el.style.opacity = "";
        el.style.transform = "";
      },
    });
  }, [columnId]);
};