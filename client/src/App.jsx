import React from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Clients from "./pages/Clients.jsx";
import Compliances from "./pages/Compliances.jsx";
import Tasks from "./pages/Tasks.jsx";
import Employees from "./pages/Employees.jsx";
import Attendance from "./pages/Attendance.jsx";
import FollowUps from "./pages/FollowUps.jsx";
import Expenses from "./pages/Expenses.jsx";

const getUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    return null;
  }
};

function Guard({ children }) {
  const token =
    localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function AdminOnly({ children }) {
  const user = getUser();

  if (user?.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={
          <Guard>
            <Layout />
          </Guard>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="clients"
          element={<Clients />}
        />

        <Route
          path="compliances"
          element={<Compliances />}
        />

        <Route
          path="tasks"
          element={<Tasks />}
        />

        <Route
          path="followups"
          element={<FollowUps />}
        />

        <Route
          path="attendance"
          element={<Attendance />}
        />

        <Route
          path="employees"
          element={
            <AdminOnly>
              <Employees />
            </AdminOnly>
          }
        />

        <Route
          path="expenses"
          element={
            <AdminOnly>
              <Expenses />
            </AdminOnly>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}