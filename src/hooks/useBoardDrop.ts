// Makes the board root a drop target so column reordering can resolve the target column.
import { useEffect, type RefObject } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { BoardColumn } from "../types/board.types";
import type { Action } from "../store/boardReducer";

export const useBoardDrop = (
  ref: RefObject<HTMLElement | null>,
  columns: BoardColumn[],
  dispatch: React.Dispatch<Action>,
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,

      onDrop: ({ source, location }) => {
        const data = source.data as {
          type: string;
          columnId: string;
        };

        if (data.type !== "column") return;

        const target = location.current.dropTargets[0];

        const targetData = target?.data as {
          columnId?: string;
        };

        const targetId = targetData?.columnId;
        if (!targetId) return;

        dispatch({
          type: "MOVE_COLUMN",
          payload: {
            fromId: data.columnId,
            toId: targetId,
          },
        });
      },
    });
  }, [columns, dispatch]);
};
