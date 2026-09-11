import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import Modal from "../components/Modal.jsx";

export default function Employees() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
  });

  const load = async () => {
    try {
      setError("");

      const response =
        await api.get("/auth/employees");

      setItems(response.data || []);
    } catch (err) {
      console.error("Employees load error:", err);

      setError(
        err.response?.data?.message ||
          "Employees load nahi ho paye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      await api.post(
        "/auth/employees",
        form
      );

      setShow(false);

      setForm({
        name: "",
        email: "",
        phone: "",
        designation: "",
        password: "",
      });

      await load();
    } catch (err) {
      console.error(
        "Create employee error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Employee create nahi ho paya."
      );
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Employees</h1>

          <p>
            Create employee access and manage
            your office team
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setShow(true)}
        >
          + Add Employee
        </button>
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel">
          Loading employees...
        </div>
      ) : items.length === 0 ? (
        <div className="panel empty-state">
          <h3>No employees yet</h3>

          <p>
            Add your first employee to start
            assigning clients and tasks.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {items.map((employee) => (
            <div
              className="person"
              key={employee._id}
            >
              <div className="avatar">
                {employee.name
                  ?.charAt(0)
                  .toUpperCase() || "E"}
              </div>

              <h3>
                {employee.name}
              </h3>

              <p>
                {employee.designation ||
                  "Employee"}
              </p>

              <small>
                {employee.email}
              </small>

              {employee.phone && (
                <small>
                  {employee.phone}
                </small>
              )}
            </div>
          ))}
        </div>
      )}

      {show && (
        <Modal
          title="Add Employee"
          onClose={() => setShow(false)}
        >
          <form
            className="form-grid"
            onSubmit={submit}
          >
            <label>
              Name

              <input
                required
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Email

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Phone

              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Designation

              <input
                type="text"
                placeholder="e.g. Accounts Executive"
                value={form.designation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    designation:
                      e.target.value,
                  })
                }
              />
            </label>

            <label className="full">
              Temporary Password

              <input
                required
                minLength={6}
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </label>

            <button
              type="submit"
              className="primary full"
            >
              Create Employee
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}