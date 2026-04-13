import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { boardReducer, type State, type Action } from "./boardReducer";
import { loadBoard, saveBoard } from "./storage";
import {
  columns as defaultColumns,
  tasks as defaultTasks,
} from "../data/board.data";

type ContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const BoardContext = createContext<ContextType | null>(null);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  // Initialise from localStorage; fall back to hardcoded seed data.
  const [state, dispatch] = useReducer(boardReducer, undefined, () => {
    const data = loadBoard();
    if (data) return data;

    return {
      columns: defaultColumns,
      tasks: defaultTasks,
    };
  });

  useEffect(() => {
    saveBoard(state);
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be inside BoardProvider");
  return ctx;
};
