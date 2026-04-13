import Column from "../Column/Column";
import "./Board.scss";
import { useRef, useState } from "react";
import type { BoardColumn, Task } from "../../types/board.types";
import { useBoardDrop } from "../../hooks/useBoardDrop";
import { useBoard } from "../../store/BoardContext";

type Props = {
  columns: BoardColumn[];
  tasks: Task[];
  search: string;
};

const Board = ({ columns, tasks, search }: Props) => {
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useBoard();
  useBoardDrop(boardRef, columns, dispatch);

  return (
    <div ref={boardRef} className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasks}
          search={search}
          overColumnId={overColumnId}
          setOverColumnId={setOverColumnId}
        />
      ))}
    </div>
  );
};

export default Board;
