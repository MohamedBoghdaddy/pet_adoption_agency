import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import DashboardProvider from "./context/DashboardContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <AuthProvider>
        <DashboardProvider>
        <App />
        </DashboardProvider>
      </AuthProvider>
    </React.StrictMode>
  </Provider>
);
