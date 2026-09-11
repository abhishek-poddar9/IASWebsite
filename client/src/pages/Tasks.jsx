import {
  useEffect,
  useState,
} from "react";

import { api } from "../services/api.js";
import Modal from "../components/Modal.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Tasks() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin =
    user.role === "admin";

  const [items, setItems] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [clients, setClients] =
    useState([]);

  const [show, setShow] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      assignedTo: "",
      client: "",
      priority: "Medium",
      dueDate: "",
    });

  /* ============================
     LOAD TASKS
  ============================ */

  const load = async () => {
    try {
      const response =
        await api.get("/tasks");

      setItems(
        response.data || []
      );
    } catch (err) {
      console.error(
        "Task load error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Tasks load nahi hue."
      );
    }
  };

  /* ============================
     INITIAL LOAD
  ============================ */

  useEffect(() => {
    load();

    if (isAdmin) {
      api
        .get("/auth/employees")
        .then((response) => {
          setEmployees(
            response.data || []
          );
        })
        .catch((err) => {
          console.error(
            "Employee load error:",
            err
          );
        });

      api
        .get("/clients")
        .then((response) => {
          setClients(
            response.data || []
          );
        })
        .catch((err) => {
          console.error(
            "Client load error:",
            err
          );
        });
    }
  }, []);

  /* ============================
     RESET FORM
  ============================ */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      assignedTo: "",
      client: "",
      priority: "Medium",
      dueDate: "",
    });
  };

  /* ============================
     CREATE TASK
  ============================ */

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Task title required hai."
      );

      return;
    }

    if (!form.assignedTo) {
      setError(
        "Employee select karna required hai."
      );

      return;
    }

    setLoading(true);

    try {
      /*
        IMPORTANT:
        Empty client / dueDate backend ko
        empty string ke form me nahi bhejna.
      */

      const payload = {
        title: form.title.trim(),

        description:
          form.description.trim(),

        assignedTo:
          form.assignedTo,

        priority:
          form.priority,
      };

      if (form.client) {
        payload.client =
          form.client;
      }

      if (form.dueDate) {
        payload.dueDate =
          form.dueDate;
      }

      const response =
        await api.post(
          "/tasks",
          payload
        );

      console.log(
        "Task created:",
        response.data
      );

      setShow(false);

      resetForm();

      setSuccess(
        "Task successfully create ho gaya."
      );

      await load();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Task create error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Task create nahi hua."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     CHANGE TASK STATUS
  ============================ */

  const changeStatus = async (
    id,
    status
  ) => {
    try {
      setError("");

      await api.patch(
        `/tasks/${id}/status`,
        {
          status,
        }
      );

      await load();
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Task status update nahi hua."
      );
    }
  };

  return (
    <>
      {/* ============================
          PAGE HEADER
      ============================ */}

      <div className="page-head">
        <div>
          <h1>
            {isAdmin
              ? "Tasks"
              : "My Tasks"}
          </h1>

          <p>
            {isAdmin
              ? "Assign and track office work"
              : "Tasks currently assigned to you"}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              setError("");
              setSuccess("");
              setShow(true);
            }}
          >
            + Assign Task
          </button>
        )}
      </div>

      {/* ============================
          ERROR
      ============================ */}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {/* ============================
          SUCCESS
      ============================ */}

      {success && (
        <div className="task-success">
          ✓ {success}
        </div>
      )}

      {/* ============================
          TASK LIST
      ============================ */}

      <div className="cards-list">
        {items.length === 0 ? (
          <div className="panel empty-state">
            <h3>
              {isAdmin
                ? "No tasks yet"
                : "No tasks assigned"}
            </h3>

            <p>
              {isAdmin
                ? "Assign a task to an employee to get started."
                : "You currently have no assigned tasks."}
            </p>
          </div>
        ) : (
          items.map((task) => (
            <div
              className="task-card"
              key={task._id}
            >
              <div>
                <h3>
                  {task.title}
                </h3>

                <p>
                  {task.client?.name ||
                    "Internal Office Task"}

                  {isAdmin &&
                    task.assignedTo
                      ?.name &&
                    ` · ${task.assignedTo.name}`}
                </p>

                {task.description && (
                  <small>
                    {
                      task.description
                    }
                  </small>
                )}
              </div>

              <div className="task-meta">
                <StatusBadge
                  value={
                    task.priority
                  }
                />

                <span>
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "No due date"}
                </span>

                <select
                  value={
                    task.status
                  }
                  onChange={(event) =>
                    changeStatus(
                      task._id,
                      event.target
                        .value
                    )
                  }
                >
                  {[
                    "To Do",
                    "In Progress",
                    "Blocked",
                    "Done",
                  ].map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================
          CREATE TASK MODAL
      ============================ */}

      {isAdmin && show && (
        <Modal
          title="Assign Task"
          onClose={() => {
            setShow(false);
            setError("");
          }}
        >
          <form
            className="form-grid"
            onSubmit={submit}
          >
            {/* TITLE */}

            <label>
              Title

              <input
                required
                type="text"
                placeholder="e.g. Prepare GST Return"
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,

                    title:
                      event.target
                        .value,
                  })
                }
              />
            </label>

            {/* EMPLOYEE */}

            <label>
              Employee

              <select
                required
                value={
                  form.assignedTo
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    assignedTo:
                      event.target
                        .value,
                  })
                }
              >
                <option value="">
                  Select Employee
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={
                        employee._id
                      }
                      value={
                        employee._id
                      }
                    >
                      {
                        employee.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            {/* CLIENT */}

            <label>
              Client (optional)

              <select
                value={
                  form.client
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    client:
                      event.target
                        .value,
                  })
                }
              >
                <option value="">
                  Internal task
                </option>

                {clients.map(
                  (client) => (
                    <option
                      key={
                        client._id
                      }
                      value={
                        client._id
                      }
                    >
                      {
                        client.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            {/* PRIORITY */}

            <label>
              Priority

              <select
                value={
                  form.priority
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    priority:
                      event.target
                        .value,
                  })
                }
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Urgent">
                  Urgent
                </option>
              </select>
            </label>

            {/* DUE DATE */}

            <label>
              Due Date

              <input
                type="date"
                value={
                  form.dueDate
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    dueDate:
                      event.target
                        .value,
                  })
                }
              />
            </label>

            {/* DESCRIPTION */}

            <label>
              Description

              <input
                type="text"
                placeholder="Task details..."
                value={
                  form.description
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    description:
                      event.target
                        .value,
                  })
                }
              />
            </label>

            {/* ERROR INSIDE MODAL */}

            {error && (
              <div className="page-error full">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              className="primary full"
              disabled={loading}
            >
              {loading
                ? "Creating Task..."
                : "Create Task"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}