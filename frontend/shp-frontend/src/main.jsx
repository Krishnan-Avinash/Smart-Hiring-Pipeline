import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import SnackbarProvider from "./context/SnackbarContext";
import App from "./App.jsx";
import "./styles/combiner.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>,
);
