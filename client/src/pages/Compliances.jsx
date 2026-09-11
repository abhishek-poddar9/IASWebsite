import {
  useEffect,
  useState,
} from "react";

import { api } from "../services/api.js";
import Modal from "../components/Modal.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const serviceOptions = [
  "Income Tax Return",
  "GST Return",
  "TDS Return",
  "ROC / MCA Filing",
  "Tax Audit",
  "Accounting / Bookkeeping",
  "Payroll",
  "Notice Response",
  "Other",
];

export default function Compliances() {
  const user = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  const isAdmin =
    user.role === "admin";

  const [items, setItems] =
    useState([]);

  const [clients, setClients] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [show, setShow] =
    useState(false);

  const [form, setForm] =
    useState({
      client: "",
      service: "GST Return",
      period: "",
      dueDate: "",
      assignedTo: "",
      remarks: "",
    });

  const load = async () => {
    const response =
      await api.get(
        "/compliances"
      );

    setItems(response.data);
  };

  useEffect(() => {
    load();

    if (isAdmin) {
      api
        .get("/clients")
        .then((response) =>
          setClients(
            response.data
          )
        );

      api
        .get("/auth/employees")
        .then((response) =>
          setEmployees(
            response.data
          )
        );
    }
  }, []);

  const submit = async (
    event
  ) => {
    event.preventDefault();

    await api.post(
      "/compliances",
      form
    );

    setShow(false);

    await load();
  };

  const changeStatus =
    async (id, status) => {
      await api.put(
        `/compliances/${id}`,
        {
          status,
        }
      );

      await load();
    };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            {isAdmin
              ? "Compliance Tracker"
              : "My Compliance"}
          </h1>

          <p>
            {isAdmin
              ? "Client-wise due dates, filing status and document tracking"
              : "Compliance work assigned to you"}
          </p>
        </div>

        {isAdmin && (
          <button
            className="primary"
            onClick={() =>
              setShow(true)
            }
          >
            + Add Compliance
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                Client
              </th>

              <th>
                Service
              </th>

              <th>
                Period
              </th>

              <th>
                Due Date
              </th>

              <th>
                Status
              </th>

              {isAdmin && (
                <th>
                  Assigned
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    isAdmin ? 6 : 5
                  }
                >
                  {isAdmin
                    ? "No compliance records."
                    : "No compliance is assigned to you."}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={
                    item._id
                  }
                >
                  <td>
                    <b>
                      {item.client
                        ?.name ||
                        "—"}
                    </b>

                    <small>
                      {item.client
                        ?.clientCode ||
                        ""}
                    </small>
                  </td>

                  <td>
                    {
                      item.service
                    }
                  </td>

                  <td>
                    {item.period ||
                      "—"}
                  </td>

                  <td>
                    {new Date(
                      item.dueDate
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={
                        item.status
                      }
                      onChange={(
                        event
                      ) =>
                        changeStatus(
                          item._id,
                          event.target
                            .value
                        )
                      }
                    >
                      {[
                        "Pending",
                        "In Progress",
                        "Waiting for Client",
                        "Filed",
                        "Completed",
                      ].map(
                        (status) => (
                          <option
                            key={
                              status
                            }
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>

                    {item.computedStatus ===
                      "Overdue" && (
                      <StatusBadge value="Overdue" />
                    )}
                  </td>

                  {isAdmin && (
                    <td>
                      {item
                        .assignedTo
                        ?.name ||
                        "—"}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAdmin && show && (
        <Modal
          title="Add Compliance Work"
          onClose={() =>
            setShow(false)
          }
        >
          <form
            className="form-grid"
            onSubmit={submit}
          >
            <label>
              Client

              <select
                required
                value={
                  form.client
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    client:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select client
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

            <label>
              Service

              <select
                value={
                  form.service
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    service:
                      e.target.value,
                  })
                }
              >
                {serviceOptions.map(
                  (service) => (
                    <option
                      key={
                        service
                      }
                    >
                      {service}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Period

              <input
                value={
                  form.period
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    period:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Due Date

              <input
                type="date"
                required
                value={
                  form.dueDate
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Assign Employee

              <select
                required
                value={
                  form.assignedTo
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignedTo:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select employee
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

            <label>
              Remarks

              <input
                value={
                  form.remarks
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    remarks:
                      e.target.value,
                  })
                }
              />
            </label>

            <button className="primary full">
              Save Compliance
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}