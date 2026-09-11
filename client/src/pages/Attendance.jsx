import {
  useEffect,
  useState,
} from "react";

import { api } from "../services/api.js";

export default function Attendance() {
  const user = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  const isAdmin =
    user.role === "admin";

  const [items, setItems] =
    useState([]);

  const [error, setError] =
    useState("");

  const load = async () => {
    try {
      const response =
        await api.get(
          isAdmin
            ? "/attendance"
            : "/attendance/my"
        );

      setItems(response.data);
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Attendance load failed"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mark = async (type) => {
    try {
      setError("");

      await api.post(
        `/attendance/${type}`
      );

      await load();
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Attendance update failed"
      );
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            {isAdmin
              ? "Attendance"
              : "My Attendance"}
          </h1>

          <p>
            {isAdmin
              ? "Employee attendance records"
              : "Mark and view your attendance"}
          </p>
        </div>

        {!isAdmin && (
          <div className="actions">
            <button
              className="primary"
              onClick={() =>
                mark("check-in")
              }
            >
              Check In
            </button>

            <button
              className="secondary"
              onClick={() =>
                mark("check-out")
              }
            >
              Check Out
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {isAdmin && (
                <th>
                  Employee
                </th>
              )}

              <th>
                Date
              </th>

              <th>
                Status
              </th>

              <th>
                Check In
              </th>

              <th>
                Check Out
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    isAdmin ? 5 : 4
                  }
                >
                  No attendance
                  records found.
                </td>
              </tr>
            ) : (
              items.map(
                (item) => (
                  <tr
                    key={
                      item._id
                    }
                  >
                    {isAdmin && (
                      <td>
                        {item
                          .employee
                          ?.name ||
                          "—"}
                      </td>
                    )}

                    <td>
                      {
                        item.date
                      }
                    </td>

                    <td>
                      {
                        item.status
                      }
                    </td>

                    <td>
                      {item.checkIn
                        ? new Date(
                            item.checkIn
                          ).toLocaleTimeString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    <td>
                      {item.checkOut
                        ? new Date(
                            item.checkOut
                          ).toLocaleTimeString(
                            "en-IN"
                          )
                        : "—"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}