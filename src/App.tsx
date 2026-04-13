import { useMemo, useState } from "react";
import Board from "./components/Board/Board";
import Header from "./components/Header/Header";
import TopToolbar from "./components/TopToolbar/TopToolbar";
import TaskModal from "./components/TopToolbar/TaskModal/TaskModal";
import type { Filter, Task } from "./types/board.types";
import { matchTask } from "./utils/search";
import {
  deleteSelectedTasks,
  completeSelectedTasks,
  uncompleteSelectedTasks,
} from "./utils/taskActions";
import Preloader from "./components/Preloader/Preloader";
import { useBoard } from "./store/BoardContext";

type AddTaskInput = {
  description: string;
  columnId: string;
  tag: string;
};

type TaskUpdater = (tasks: Task[]) => Task[];

function App() {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { state, dispatch } = useBoard();

  const tasks = state.tasks;
  const columns = state.columns;

  const updateTasks = (tasksUpdater: TaskUpdater) => {
    dispatch({
      type: "SET_DATA",
      payload: {
        ...state,
        tasks: tasksUpdater(state.tasks),
      },
    });
  };

  const deleteSelected = () => {
    updateTasks(deleteSelectedTasks);
  };

  const completeSelected = () => {
    updateTasks(completeSelectedTasks);
  };

  const uncompleteSelected = () => {
    updateTasks(uncompleteSelectedTasks);
  };

  const clearSelection = () => {
    updateTasks((tasks) => tasks.map((t) => ({ ...t, selected: false })));
  };

  const addColumn = (title: string, color: string) => {
    dispatch({
      type: "ADD_COLUMN",
      payload: { title, color },
    });
  };

  const handleAddTask = ({ description, columnId, tag }: AddTaskInput) => {
    dispatch({
      type: "ADD_TASK",
      payload: {
        id: crypto.randomUUID(),
        title: description,
        columnId,
        tags: [tag],
        completed: false,
        createdAt: Date.now(),
      },
    });
  };

  const selectedTasks = useMemo(() => tasks.filter((t) => t.selected), [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "incomplete" && !task.completed);

      const matchesSearch = matchTask(task.title, search);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Header />
          <TopToolbar
            onAddTask={() => setTaskModalOpen(true)}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
            onAddColumn={addColumn}
          />

          {selectedTasks.length > 0 && (
            <div className="bulk-bar">
              <span>{selectedTasks.length} selected</span>

              <button onClick={completeSelected}>Complete</button>
              <button onClick={uncompleteSelected}>Uncomplete</button>
              <button onClick={deleteSelected}>Delete</button>
              <button onClick={clearSelection}>Clear</button>
            </div>
          )}

          <Board columns={columns} tasks={filteredTasks} search={search} />

          <TaskModal
            open={isTaskModalOpen}
            onClose={() => setTaskModalOpen(false)}
            columns={columns}
            onSubmit={handleAddTask}
          />
        </>
      )}
    </>
  );
}

export default App;
