import React from "react";
import ReactDOM from "react-dom/client";
import { Notifications } from "@mantine/notifications";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ColorSchemeProvider } from './context/ColorSchemeProvider';

import App from "./App";
import HomePage from "./pages/HomePage";
import ForecastPage from "./pages/ForecastPage";

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
      //{ path: 'history', element: <HistoryPage /> },
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
