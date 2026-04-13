import "./Tag.scss";

type Props = {
  label: string;
  color?: string;
};

const Tag = ({ label, color }: Props) => {
  return (
    <span className="tag" style={{ background: color || "#877a7a" }}>
      {label}
    </span>
  );
};

export default Tag;
