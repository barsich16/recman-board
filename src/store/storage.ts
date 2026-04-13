import type { State } from "./boardReducer";

const STORAGE_KEY = "board-data";

export const loadBoard = (): State | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveBoard = (data: State): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota exceeded or private-browsing restrictions.
  }
};
