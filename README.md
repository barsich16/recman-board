# Recman Board

A Kanban-style task management board built with React, TypeScript, and Vite. Drag cards between columns, filter and search tasks, and manage them in bulk — all persisted to `localStorage`.

## Features

- **Kanban board** — multiple columns with drag-and-drop reordering for both tasks and columns
- **Task management** — create, edit, delete, and toggle tasks as complete/incomplete
- **Bulk actions** — select multiple tasks across a column and complete, uncomplete, or delete them at once
- **Search & filter** — live search with keyword highlighting; filter by All / Completed / Incomplete
- **Tags** — label each task with a colour-coded tag (Enhancement, Bug, Design, Change Request)
- **Custom columns** — add new columns with a custom accent colour via a colour picker
- **Persistence** — board state is saved to `localStorage` and restored on next visit
- **Animated preloader** — GSAP-powered intro animation on first load

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Static typing |
| [Vite](https://vite.dev) | Build tool & dev server |
| [SASS](https://sass-lang.com) | Scoped component styles |
| [@atlaskit/pragmatic-drag-and-drop](https://atlassian.design/components/pragmatic-drag-and-drop) | Drag-and-drop primitives |
| [GSAP](https://gsap.com) | Animations |
| [react-color](https://casesandberg.github.io/react-color/) | Colour picker for custom columns |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── components/       # UI components (Board, Column, Card, …)
├── hooks/            # Custom React hooks (drag-and-drop, click-outside)
├── store/            # State management (reducer, context, localStorage)
├── types/            # Shared TypeScript types
├── utils/            # Pure helpers (date formatting, search/highlight)
├── data/             # Seed data (default columns and tasks)
└── styles/           # Global SASS variables, mixins, and base styles
```

## State Management

Board state lives in a single `useReducer` store exposed via React Context (`BoardContext`). Every change is automatically persisted to `localStorage`. On first load, seed data from `src/data/board.data.ts` is used as the initial state.
