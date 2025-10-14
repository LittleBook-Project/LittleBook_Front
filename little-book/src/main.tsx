import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile"; // ⬅️ ajoute ceci

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} /> {/* ⬅️ nouvelle route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
