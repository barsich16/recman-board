import { useEffect, useRef, useState } from "react";
import "./TaskModal.scss";
import type { BoardColumn } from "../../../types/board.types";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { IoIosArrowDown } from "react-icons/io";
import { BsTag } from "react-icons/bs";
import { tagColors } from "../../../data/board.data";

type Props = {
  open: boolean;
  onClose: () => void;
  columns: BoardColumn[];
  defaultColumnId?: string;
  onSubmit: (data: {
    description: string;
    columnId: string;
    tag: string;
  }) => void;
};

const TaskModal = ({
  open,
  onClose,
  columns,
  defaultColumnId,
  onSubmit,
}: Props) => {
  const [description, setDescription] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [tag, setTag] = useState<string>("Enhancement");
  const [openTags, setOpenTags] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false), dropdownOpen);
  useClickOutside(tagRef, () => setOpenTags(false), openTags);

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (!open) return;

    const id = defaultColumnId || columns[0]?.id || "";

      setDescription("");
      setTag("Enhancement");
      setSelectedColumn(id);
  }, [open, defaultColumnId, columns]);

  if (!open) return null;

  const currentColumn = columns.find((c) => c.id === selectedColumn);

  const handleCreate = () => {
    if (!description.trim()) return;

    onSubmit({
      description,
      columnId: selectedColumn,
      tag,
    });

    onClose();
  };

  return (
    <div className="task__modal">
      <div className="task__modal-overlay" onClick={onClose} />
      <div className="task__modal-content">
        <h3 className="task__modal-title">Create new task</h3>
        <textarea
          ref={textareaRef}
          className="task__modal-textarea"
          placeholder="Task description..."
          value={description}
          onChange={handleTextarea}
          autoFocus
        />

        <div className="task__modal-dropdown" ref={dropdownRef}>
          <button
            className="task__modal-dropdown-btn"
            onClick={() => setDropdownOpen((p) => !p)}
          >
            {currentColumn?.title || "Select column"}

            <IoIosArrowDown
              className={`task__modal-dropdown-arrow ${
                dropdownOpen ? "open" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="task__modal-dropdown-menu">
              {columns.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    setSelectedColumn(col.id);
                    setDropdownOpen(false);
                  }}
                >
                  {col.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="task__modal-tag" ref={tagRef}>
          <button
            className="task__modal-tag-trigger"
            onClick={() => setOpenTags((p) => !p)}
          >
            <BsTag className="task__modal-tag-icon" />
            {tag}

            <IoIosArrowDown
              className={`task__modal-tag-arrow ${openTags ? "open" : ""}`}
            />
          </button>
          {openTags && (
            <div className="task__modal-tag-dropdown">
              {Object.keys(tagColors).map((t) => (
                <button
                  key={t}
                  className="task__modal-tag-option"
                  onClick={() => {
                    setTag(t);
                    setOpenTags(false);
                  }}
                >
                  <BsTag className="task__modal-tag-icon" />
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="task__modal-actions">
          <button
            className="task__modal-btn task__modal-btn--primary"
            onClick={handleCreate}
          >
            Create
          </button>
          <button
            className="task__modal-btn task__modal-btn--ghost"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
