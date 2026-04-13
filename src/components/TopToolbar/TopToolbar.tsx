import { useRef, useState } from "react";
import "./TopToolbar.scss";
import { MdOutlineAdd } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { useClickOutside } from "../../hooks/useClickOutside";
import type { Filter } from "../../types/board.types";
import AddColumn from "../AddColumn/AddColumn";

type Props = {
  onAddTask: () => void;
  onFilterChange: (value: Filter) => void;
  onSearchChange: (value: string) => void;
  onAddColumn: (title: string, color: string) => void;
};

const TopToolbar = ({
  onAddTask,
  onFilterChange,
  onSearchChange,
  onAddColumn,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("All");
  const toolbarRef = useRef<HTMLDivElement>(null);

  useClickOutside(toolbarRef, () => setOpen(false), open);

  const options: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Incomplete", value: "incomplete" },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <input
          className="toolbar__search"
          placeholder="Search tasks..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="toolbar__right">
        <div className="toolbar__add-column">
          <AddColumn onAddColumn={onAddColumn} />
        </div>
        <div className="toolbar__dropdown">
          <button
            className="toolbar__dropdown-btn"
            onClick={() => setOpen((p) => !p)}
          >
            {value}
            <IoIosArrowDown className={`toolbar__icon ${open ? "open" : ""}`} />
          </button>
          {open && (
            <div ref={toolbarRef} className="toolbar__dropdown-menu">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setValue(opt.label);
                    onFilterChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onAddTask}
          className="toolbar__btn toolbar__btn--primary"
        >
          <MdOutlineAdd size={20} /> Add Task
        </button>
      </div>
    </div>
  );
};

export default TopToolbar;
