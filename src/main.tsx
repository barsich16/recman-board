import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/_common.scss";
import App from "./App.tsx";
import { BoardProvider } from "./store/BoardContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </StrictMode>
);
