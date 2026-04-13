import { useState } from "react";
import "./AddColumn.scss";
import { SketchPicker } from "react-color";

type Props = {
  onAddColumn: (title: string, color: string) => void;
};

const AddColumn = ({ onAddColumn }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [showPicker, setShowPicker] = useState(false);

  const handleAdd = () => {
    if (!value.trim()) return;

    onAddColumn(value, color);
    setValue("");
    setOpen(false);
  };

  if (!open) {
    return (
      <div className="add__column" onClick={() => setOpen(true)}>
        + Add Column
      </div>
    );
  }

  return (
    <div className="add__column">
      <input
        placeholder="Column name..."
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="add__column-actions">
        <button onClick={handleAdd}>Add</button>
        <button onClick={() => setOpen(false)}>Cancel</button>
      </div>
      <div className="color__picker">
        <button
          className="color__dot"
          style={{ background: color }}
          onClick={() => setShowPicker((p) => !p)}
        />

        <span onClick={() => setShowPicker((p) => !p)}>
          Choose color column
        </span>

        {showPicker && (
          <div className="color__picker-popover">
            <SketchPicker color={color} onChange={(c) => setColor(c.hex)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddColumn;
