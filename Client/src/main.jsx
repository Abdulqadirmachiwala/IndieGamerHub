import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#1E293B",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
    },
  }}
/>
    </BrowserRouter>
  </React.StrictMode>
);