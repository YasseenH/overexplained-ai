import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignupPage, ErrorPage, ConfirmPage } from "./routes/index.ts";
import React from "react";
import { ConfirmEmailPage } from "./routes/confirm-email.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignupPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirm-email-sent",
    element: <ConfirmPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirm-email",
    element: <ConfirmEmailPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
