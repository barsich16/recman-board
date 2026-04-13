import { useState, useMemo, useRef } from "react";
import type { BoardColumn, Task, ColumnId } from "../../types/board.types";
import gsap from "gsap";
import type { Action } from "../../store/boardReducer";

type Props = {
  column: BoardColumn;
  tasks: Task[];
  dispatch: React.Dispatch<Action>;
};

export const useColumn = ({ column, tasks, dispatch }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(column.title);

  const columnRef = useRef<HTMLDivElement>(null);

  const columnTasks = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id);
  }, [tasks, column.id]);

  const toggleCheck = (id: string) => {
    dispatch({
      type: "TOGGLE_TASK",
      payload: { taskId: id },
    });
  };

  const deleteTask = (id: string) => {
    dispatch({
      type: "DELETE_TASK",
      payload: { taskId: id },
    });
  };

  const handleAddTask = (title: string, columnId: ColumnId, tag: string) => {
    if (!title.trim()) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        id: crypto.randomUUID(),
        title,
        columnId,
        tags: [tag],
        completed: false,
        createdAt: Date.now(),
      },
    });
  };

  const handleEdit = (id: string, newTitle: string) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { taskId: id, title: newTitle },
    });
  };

  const handleRename = (id: ColumnId, newTitle: string) => {
    dispatch({
      type: "RENAME_COLUMN",
      payload: { columnId: id, title: newTitle },
    });
  };

  const handleDeleteColumn = (id: ColumnId) => {
    if (!columnRef.current) return;

    gsap.to(columnRef.current, {
      duration: 0.4,
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)",
      ease: "power1.out",
      onComplete: () => {
        dispatch({
          type: "DELETE_COLUMN",
          payload: { columnId: id },
        });
      },
    });
  };

  const toggleAll = () => {
    dispatch({
      type: "TOGGLE_ALL",
      payload: { columnId: column.id },
    });
  };

  return {
    menuOpen,
    setMenuOpen,
    isEditing,
    setIsEditing,
    value,
    setValue,
    columnRef,
    columnTasks,
    toggleCheck,
    deleteTask,
    handleAddTask,
    handleEdit,
    handleRename,
    handleDeleteColumn,
    toggleAll,
  };
};
