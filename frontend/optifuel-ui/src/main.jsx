import React from "react";
import ReactDOM from "react-dom/client";
import { Notifications } from "@mantine/notifications";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ColorSchemeProvider } from "./context/ColorSchemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";

import App from "./App";
import HomePage from "./pages/HomePage";
import ForecastPage from "./pages/ForecastPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VoyageDetailsPage from "./pages/VoyageDetailsPage";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "predict", element: <ForecastPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "voyages/:id",
        element: (
          <ProtectedRoute>
            <VoyageDetailsPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <AuthProvider>
        <Notifications position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </ColorSchemeProvider>
  </React.StrictMode>
);
