import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
// src/main.tsx
import { bootstrapAuthFromStorage } from "@/api/api";
bootstrapAuthFromStorage();
;
import App from "./App";
import "./index.css"; // tailwind/globals

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
