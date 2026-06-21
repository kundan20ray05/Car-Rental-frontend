import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { MotionConfig } from "motion/react";
import { ClerkProvider } from "@clerk/react";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkKey}>
    <BrowserRouter>
      <AppProvider>
        <MotionConfig viewport={{ once: true }}>
          <App />
        </MotionConfig>
      </AppProvider>
    </BrowserRouter>
  </ClerkProvider>,
);
