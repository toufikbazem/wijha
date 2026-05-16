import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import "./index.css";
import App from "./App";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      <Toaster />
    </PersistGate>
  </Provider>
);
