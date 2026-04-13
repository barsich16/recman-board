import "./ColumnMenu.scss";

type Props = {
  onRename: () => void;
  onDelete: () => void;
};

const ColumnMenu = ({ onRename, onDelete }: Props) => {
  return (
    <div className="column-menu-dropdown">
      <button onClick={onRename}>Rename</button>
      <button className="delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default ColumnMenu;
