import {
  useEffect,
  useState,
} from "react";

import { api } from "../services/api.js";
import Modal from "../components/Modal.jsx";

export default function FollowUps() {
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

  const [show, setShow] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      client: "",
      mode: "Call",
      summary: "",
      outcome: "",
      nextFollowUp: "",
    });

  const load = async () => {
    const response =
      await api.get(
        "/followups"
      );

    setItems(response.data);
  };

  const loadClients =
    async () => {
      const response =
        await api.get(
          "/clients"
        );

      setClients(response.data);
    };

  useEffect(() => {
    load();
    loadClients();
  }, []);

  const submit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setError("");

      await api.post(
        "/followups",
        form
      );

      setShow(false);

      setForm({
        client: "",
        mode: "Call",
        summary: "",
        outcome: "",
        nextFollowUp: "",
      });

      await load();
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Follow-up save failed"
      );
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            {isAdmin
              ? "Client Follow-ups"
              : "My Follow-ups"}
          </h1>

          <p>
            {isAdmin
              ? "Calls, WhatsApp, email and meeting history"
              : "Follow-ups for clients assigned to you"}
          </p>
        </div>

        <button
          className="primary"
          onClick={() =>
            setShow(true)
          }
        >
          + Add Follow-up
        </button>
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      <div className="cards-list">
        {items.length === 0 ? (
          <div className="panel empty-state">
            <h3>
              No follow-ups
            </h3>

            <p>
              No follow-up records
              found.
            </p>
          </div>
        ) : (
          items.map(
            (followUp) => (
              <div
                className="task-card"
                key={
                  followUp._id
                }
              >
                <div>
                  <h3>
                    {followUp
                      .client
                      ?.name ||
                      "Client"}
                  </h3>

                  <p>
                    {
                      followUp.summary
                    }
                  </p>

                  <small>
                    {isAdmin &&
                      followUp
                        .employee
                        ?.name &&
                      `${followUp.employee.name} · `}

                    {
                      followUp.mode
                    }{" "}
                    ·{" "}

                    {new Date(
                      followUp.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </small>
                </div>

                <div className="task-meta">
                  <span>
                    {followUp.outcome ||
                      "—"}
                  </span>

                  <b>
                    {followUp.nextFollowUp
                      ? `Next: ${new Date(
                          followUp.nextFollowUp
                        ).toLocaleDateString(
                          "en-IN"
                        )}`
                      : ""}
                  </b>
                </div>
              </div>
            )
          )
        )}
      </div>

      {show && (
        <Modal
          title={
            isAdmin
              ? "Add Client Follow-up"
              : "Add My Follow-up"
          }
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
              Mode

              <select
                value={
                  form.mode
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    mode:
                      e.target.value,
                  })
                }
              >
                {[
                  "Call",
                  "WhatsApp",
                  "Email",
                  "Meeting",
                  "Other",
                ].map(
                  (mode) => (
                    <option
                      key={
                        mode
                      }
                    >
                      {mode}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="full">
              Summary

              <textarea
                required
                value={
                  form.summary
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    summary:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Outcome

              <input
                value={
                  form.outcome
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    outcome:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Next Follow-up

              <input
                type="date"
                value={
                  form.nextFollowUp
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    nextFollowUp:
                      e.target.value,
                  })
                }
              />
            </label>

            <button className="primary full">
              Save Follow-up
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}