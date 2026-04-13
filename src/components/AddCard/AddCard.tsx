import { useRef, useState } from "react";
import "./AddCard.scss";
import { BsPlusCircle } from "react-icons/bs";
import type { ColumnId } from "../../types/board.types";
import { tagColors } from "../../data/board.data";
import { IoIosArrowDown } from "react-icons/io";
import { BsTag } from "react-icons/bs";
import { useClickOutside } from "../../hooks/useClickOutside";

type Props = {
  onAdd: (title: string, columnId: ColumnId, tag: string) => void;
  columnId: ColumnId;
};

const AddCard = ({ onAdd, columnId }: Props) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [value, setValue] = useState("");
  const [tag, setTag] = useState<string>("Enhancement");
  const [openTags, setOpenTags] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(wrapperRef, () => setOpenTags(false), openTags);

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value, columnId, tag);

    setValue("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!open) {
    return (
      <div
        className={`add__card ${hovered ? "is-hovered" : ""}`}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="add__card-layer add__card-layer--top">
          <BsPlusCircle size={16} /> New
        </span>

        <span className="add__card-layer add__card-layer--bottom">
          <BsPlusCircle size={16} /> New
        </span>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="add__card-wrapper">
      <div className="add__card">
        <textarea
          placeholder="Task title..."
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="tag__select-trigger"
          onClick={() => setOpenTags((p) => !p)}
        >
          <BsTag className={`tag__icon tag__icon--${tag}`} />
          {tag}
          <IoIosArrowDown className={`tag__arrow ${openTags ? "open" : ""}`} />
        </button>

        <div className="add__card-actions">
          <button onClick={handleAdd}>Add</button>
          <button
            onClick={() => {
              setOpen(false);
              setValue("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {openTags && (
        <div className="tag__select-dropdown">
          {Object.keys(tagColors).map((tag) => (
            <button
              key={tag}
              className={`tag__select-option tag__select-option--${tag}`}
              onClick={() => {
                setTag(tag);
                setOpenTags(false);
              }}
            >
              <BsTag className="tag__icon" />
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddCard;
