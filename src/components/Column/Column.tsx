import type { BoardColumn, Task } from "../../types/board.types";
import AddCard from "../AddCard/AddCard";
import Card from "../Card/Card";
import "./Column.scss";
import { PiDotsThreeOutlineDuotone } from "react-icons/pi";
import { useRef } from "react";
import ColumnMenu from "./ColumnMenu";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useColumn } from "./useColumn";
import { MdDoneAll } from "react-icons/md";
import { useColumnDrop } from "../../hooks/useColumnDrop";
import { useDraggableColumn } from "../../hooks/useDraggableColumn";
import { useBoard } from "../../store/BoardContext";

type Props = {
  column: BoardColumn;
  tasks: Task[];
  search: string;
  overColumnId: string | null;
  setOverColumnId: (id: string | null) => void;
};

const Column = ({
  column,
  tasks,
  search,
  overColumnId,
  setOverColumnId,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const { dispatch, state } = useBoard();
  const {
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
  } = useColumn({ column, tasks, dispatch });

  useColumnDrop(columnRef, column.id, dispatch, setOverColumnId, state.tasks);
  useDraggableColumn(columnRef, column.id);

  const allSelected =
    columnTasks.length > 0 && columnTasks.every((t) => t.selected);

  const isDefaultColumn =
    column.id === "todo" ||
    column.id === "progress" ||
    column.id === "done" ||
    column.id === "backlog";

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const submitRename = () => {
    if (!value.trim()) return;

    handleRename(column.id, value);
    setIsEditing(false);
  };

  const cancelRename = () => {
    setValue(column.title);
    setIsEditing(false);
  };

  const renderTitle = () => {
    if (isEditing) {
      return (
        <input
          className="column__input"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={submitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitRename();
            if (e.key === "Escape") cancelRename();
          }}
        />
      );
    }
    return <span className="column__title-text">{column.title}</span>;
  };

  return (
    <div
      ref={columnRef}
      data-column-id={column.id}
      className={`
  column
  ${isDefaultColumn ? `column--${column.id}` : ""}
  ${overColumnId === column.id ? "column--over" : ""}
`}
      style={
        {
          background: column.color + "25",
          "--column-accent": column.color,
        } as React.CSSProperties
      }
    >
      <div className="column__header">
        <div className="column__title">
          <label className="column__select-all">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            <MdDoneAll className="icon" size={20} />
          </label>

          {renderTitle()}
          <span className="column__count">{columnTasks.length}</span>
        </div>

        <div ref={menuRef} className="column__actions">
          <button
            className="column__menu-btn"
            onClick={() => setMenuOpen((p) => !p)}
          >
            <PiDotsThreeOutlineDuotone />
          </button>

          {menuOpen && (
            <ColumnMenu
              onRename={() => {
                setIsEditing(true);
                setMenuOpen(false);
              }}
              onDelete={() => {
                handleDeleteColumn(column.id);
                setMenuOpen(false);
              }}
            />
          )}
        </div>
      </div>

      <div className="column__list">
        {columnTasks.length === 0 ? (
          <div className="column__empty">No tasks</div>
        ) : (
          columnTasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              onToggle={toggleCheck}
              onDelete={deleteTask}
              onEdit={handleEdit}
              search={search}
            />
          ))
        )}
      </div>

      <AddCard onAdd={handleAddTask} columnId={column.id} />
    </div>
  );
};

export default Column;
