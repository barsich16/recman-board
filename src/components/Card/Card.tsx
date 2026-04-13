import { tagColors } from "../../data/board.data";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useDraggableTask } from "../../hooks/useDraggableTask";
import { useTaskDrop } from "../../hooks/useTaskDrop";
import { useBoard } from "../../store/BoardContext";
import type { Task } from "../../types/board.types";
import { formatCompletedTime, formatDate } from "../../utils/date";
import { highlightText } from "../../utils/search";
import Tag from "../Tag/Tag";
import "./Card.scss";
import { useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  search: string;
};

const Card = ({ task, onToggle, onDelete, onEdit, search }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  useDraggableTask(cardRef, task.id, task.columnId);
  const { state, dispatch } = useBoard();
  const tasks = state.tasks;

  useTaskDrop(cardRef, task, dispatch, tasks);
  useClickOutside(cardRef, () => setMenu(false), menu);

  const completedTime =
    task.completed && task.completedAt
      ? formatCompletedTime(task.completedAt)
      : null;

  const submitEdit = () => {
    if (!value.trim()) return;

    onEdit(task.id, value);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setValue(task.title);
    setIsEditing(false);
  };

  const renderTitle = () => {
    if (isEditing) {
      return (
        <input
          className="card__input"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitEdit();
            if (e.key === "Escape") cancelEdit();
          }}
        />
      );
    }
    return <p className="card__title">{highlightText(task.title, search)}</p>;
  };

  const toggleMenu = () => setMenu((p) => !p);

  return (
    <div
      ref={cardRef}
      className={`
      card 
      ${task.completed ? "card--completed" : ""} 
      ${task.selected ? "card--selected" : ""}
    `}
    >
      <div className="card__top">
        <label className="card__checkbox">
          <input
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            type="checkbox"
          />
          <span />
        </label>
        {renderTitle()}
        <button className="card__menu-btn" onClick={toggleMenu}>
          <BiDotsVerticalRounded />
        </button>
      </div>
      <div className="card__meta">
        <span className="card__completed-time">
          {completedTime ? `Completed ${completedTime}` : ""}
        </span>
      </div>
      {menu && (
        <div className="card__menu">
          <button
            className="edit-btn"
            onClick={() => {
              setValue(task.title);
              setIsEditing(true);
              setMenu(false);
            }}
          >
            Edit
          </button>
          <button
            className="delete"
            onClick={() => {
              onDelete(task.id);
              setMenu(false);
            }}
          >
            Delete
          </button>
        </div>
      )}

      <div className="card__tags">
        {task.tags.map((tag) => (
          <Tag key={tag} label={tag} color={tagColors[tag]} />
        ))}
      </div>
      <p className="card__date">
        {formatDate(task.createdAt)}
      </p>
    </div>
  );
};

export default Card;
