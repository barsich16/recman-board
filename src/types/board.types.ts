export type ColumnId = string;

export interface BoardColumn {
  id: ColumnId;
  title: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  columnId: ColumnId;
  tags: string[];
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  selected?: boolean;
}

export type Filter = "all" | "completed" | "incomplete";
