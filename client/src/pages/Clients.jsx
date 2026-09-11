import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../services/api.js";
import Modal from "../components/Modal.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const services = [
  "Income Tax Return",
  "GST Registration",
  "GST Return",
  "TDS Return",
  "ROC / MCA Filing",
  "Company Registration",
  "LLP Registration",
  "Tax Audit",
  "Accounting / Bookkeeping",
  "Payroll",
  "DSC",
  "PAN / TAN",
  "Notice Response",
  "Other",
];

export default function Clients() {
  const user = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  const isAdmin =
    user.role === "admin";

  const [items, setItems] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [show, setShow] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [form, setForm] =
    useState({
      clientCode: "",
      name: "",
      entityType:
        "Individual",
      phone: "",
      email: "",
      status: "Lead",
      source: "Referral",
      assignedTo: "",
      services: [],
    });

  const load = async () => {
    const response =
      await api.get("/clients");

    setItems(response.data);
  };

  useEffect(() => {
    load();

    if (isAdmin) {
      api
        .get("/auth/employees")
        .then((response) =>
          setEmployees(
            response.data
          )
        );
    }
  }, []);

  const filtered =
    useMemo(() => {
      return items.filter(
        (client) =>
          `${client.name} ${
            client.clientCode
          } ${
            client.phone || ""
          }`
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );
    }, [items, query]);

  const submit = async (
    event
  ) => {
    event.preventDefault();

    await api.post(
      "/clients",
      form
    );

    setShow(false);

    await load();
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            {isAdmin
              ? "Clients & CRM"
              : "My Clients"}
          </h1>

          <p>
            {isAdmin
              ? "Leads, active clients, services and ownership"
              : "Clients currently assigned to you"}
          </p>
        </div>

        {isAdmin && (
          <button
            className="primary"
            onClick={() =>
              setShow(true)
            }
          >
            + Add Client
          </button>
        )}
      </div>

      <div className="toolbar">
        <input
          value={query}
          placeholder={
            isAdmin
              ? "Search client, code or phone..."
              : "Search my clients..."
          }
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                Client
              </th>

              <th>
                Entity
              </th>

              <th>
                Services
              </th>

              <th>
                Status
              </th>

              {isAdmin && (
                <th>
                  Assigned
                </th>
              )}

              <th>
                Next Follow-up
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ===
            0 ? (
              <tr>
                <td
                  colSpan={
                    isAdmin ? 6 : 5
                  }
                >
                  {isAdmin
                    ? "No clients found."
                    : "No clients assigned to you."}
                </td>
              </tr>
            ) : (
              filtered.map(
                (client) => (
                  <tr
                    key={
                      client._id
                    }
                  >
                    <td>
                      <b>
                        {
                          client.name
                        }
                      </b>

                      <small>
                        {
                          client.clientCode
                        }{" "}
                        ·{" "}
                        {client.phone ||
                          "No phone"}
                      </small>
                    </td>

                    <td>
                      {
                        client.entityType
                      }
                    </td>

                    <td>
                      <div className="chips">
                        {client.services
                          ?.slice(
                            0,
                            3
                          )
                          .map(
                            (
                              service
                            ) => (
                              <span
                                key={
                                  service
                                }
                              >
                                {
                                  service
                                }
                              </span>
                            )
                          )}
                      </div>
                    </td>

                    <td>
                      <StatusBadge
                        value={
                          client.status
                        }
                      />
                    </td>

                    {isAdmin && (
                      <td>
                        {client
                          .assignedTo
                          ?.name ||
                          "Unassigned"}
                      </td>
                    )}

                    <td>
                      {client.nextFollowUp
                        ? new Date(
                            client.nextFollowUp
                          ).toLocaleDateString(
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

      {isAdmin && show && (
        <Modal
          title="Add CA Client / Lead"
          onClose={() =>
            setShow(false)
          }
        >
          <form
            className="form-grid"
            onSubmit={submit}
          >
            <label>
              Client Code

              <input
                required
                value={
                  form.clientCode
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    clientCode:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Name

              <input
                required
                value={
                  form.name
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Entity Type

              <select
                value={
                  form.entityType
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    entityType:
                      e.target.value,
                  })
                }
              >
                {[
                  "Individual",
                  "Proprietorship",
                  "Partnership",
                  "LLP",
                  "Private Limited",
                  "Public Limited",
                  "Trust/Society",
                  "Other",
                ].map(
                  (value) => (
                    <option
                      key={
                        value
                      }
                    >
                      {value}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Phone

              <input
                value={
                  form.phone
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Email

              <input
                type="email"
                value={
                  form.email
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Status

              <select
                value={
                  form.status
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
              >
                {[
                  "Lead",
                  "Active",
                  "On Hold",
                  "Closed",
                ].map(
                  (value) => (
                    <option
                      key={
                        value
                      }
                    >
                      {value}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Assign Employee

              <select
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
                  Unassigned
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      value={
                        employee._id
                      }
                      key={
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
              Source

              <input
                value={
                  form.source
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    source:
                      e.target.value,
                  })
                }
              />
            </label>

            <fieldset className="full">
              <legend>
                Services
              </legend>

              <div className="check-grid">
                {services.map(
                  (service) => (
                    <label
                      className="check"
                      key={
                        service
                      }
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(
                          service
                        )}
                        onChange={(
                          event
                        ) =>
                          setForm({
                            ...form,

                            services:
                              event
                                .target
                                .checked
                                ? [
                                    ...form.services,
                                    service,
                                  ]
                                : form.services.filter(
                                    (
                                      item
                                    ) =>
                                      item !==
                                      service
                                  ),
                          })
                        }
                      />

                      {service}
                    </label>
                  )
                )}
              </div>
            </fieldset>

            <button className="primary full">
              Save Client
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}