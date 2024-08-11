import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./utils/GlobalStyle";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="top center"
      gutter={12}
      toastOptions={{
        success: { duration: 3000 },
        error: { duration: 5000 },
      }}
    />
    <GlobalStyles />
    <App />
  </StrictMode>
);
