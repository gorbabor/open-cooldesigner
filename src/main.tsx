import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useAppStore } from "./store/appStore";
import "./styles/global.css";

void useAppStore.getState().initApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
