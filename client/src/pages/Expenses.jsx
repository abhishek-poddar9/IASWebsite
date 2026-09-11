import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import Modal from "../components/Modal.jsx";

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    category: "Office",
    description: "",
    amount: "",
    paymentMode: "UPI",
    date: new Date()
      .toISOString()
      .slice(0, 10),
  });

  const load = async () => {
    try {
      setError("");

      const response =
        await api.get("/expenses");

      setItems(response.data || []);
    } catch (err) {
      console.error("Expenses load error:", err);

      setError(
        err.response?.data?.message ||
          "Expenses load nahi ho paye."
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
        "/expenses",
        form
      );

      setShow(false);

      setForm({
        category: "Office",
        description: "",
        amount: "",
        paymentMode: "UPI",
        date: new Date()
          .toISOString()
          .slice(0, 10),
      });

      await load();
    } catch (err) {
      console.error(
        "Expense save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Expense save nahi ho paya."
      );
    }
  };

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Office Expenses</h1>

          <p>
            Track daily and monthly office
            operating expenses
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setShow(true)}
        >
          + Add Expense
        </button>
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      <div className="panel mini">
        <div>
          <span>
            Total Recorded
          </span>

          <strong>
            ₹
            {total.toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>
      </div>

      {loading ? (
        <div className="panel">
          Loading expenses...
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Payment Mode</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                items.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      {expense.date
                        ? new Date(
                            expense.date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    <td>
                      {expense.category ||
                        "—"}
                    </td>

                    <td>
                      {expense.description ||
                        "—"}
                    </td>

                    <td>
                      {expense.paymentMode ||
                        "—"}
                    </td>

                    <td>
                      <b>
                        ₹
                        {Number(
                          expense.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </b>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {show && (
        <Modal
          title="Add Expense"
          onClose={() => setShow(false)}
        >
          <form
            className="form-grid"
            onSubmit={submit}
          >
            <label>
              Date

              <input
                required
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Category

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
              >
                <option value="Office">
                  Office
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Utility">
                  Utility
                </option>

                <option value="Software">
                  Software
                </option>

                <option value="Stationery">
                  Stationery
                </option>

                <option value="Salary">
                  Salary
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </label>

            <label className="full">
              Description

              <input
                type="text"
                placeholder="Expense details"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Amount

              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Payment Mode

              <select
                value={
                  form.paymentMode
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentMode:
                      e.target.value,
                  })
                }
              >
                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Bank">
                  Bank Transfer
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </label>

            <button
              type="submit"
              className="primary full"
            >
              Save Expense
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}