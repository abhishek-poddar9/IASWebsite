import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo.jsx";
import { api } from "../services/api.js";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] =
    useState("signin");

  /*
    Admin email pre-filled rahega.

    Password intentionally blank rakha hai
    security ke liye.
  */

  const [email, setEmail] =
    useState(
      "tpoddar@intimeadvisoryservices.com"
    );

  const [password, setPassword] =
    useState("");

  const [name, setName] =
    useState("");

  const [
    designation,
    setDesignation,
  ] = useState("");

  const [
    officeCode,
    setOfficeCode,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================
     CHANGE SIGN IN / SIGN UP
  ========================== */

  const changeMode = (
    newMode
  ) => {
    setMode(newMode);

    setError("");

    setShowPassword(false);

    if (
      newMode === "signin"
    ) {
      setEmail(
        "tpoddar@intimeadvisoryservices.com"
      );

      setPassword("");
    } else {
      setName("");

      setDesignation("");

      setEmail("");

      setPassword("");

      setOfficeCode("");
    }
  };

  /* ==========================
     SAVE LOGIN SESSION
  ========================== */

  const saveUser = (
    data
  ) => {
    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user
      )
    );

    navigate("/");
  };

  /* ==========================
     LOGIN / REGISTER
  ========================== */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      setLoading(true);

      try {
        /*
          SIGN IN
        */

        if (
          mode === "signin"
        ) {
          const response =
            await api.post(
              "/auth/login",
              {
                email:
                  email
                    .toLowerCase()
                    .trim(),

                password,
              }
            );

          saveUser(
            response.data
          );
        }

        /*
          SIGN UP
          Employee account only
        */

        else {
          const response =
            await api.post(
              "/auth/register",
              {
                name:
                  name.trim(),

                designation:
                  designation.trim(),

                email:
                  email
                    .toLowerCase()
                    .trim(),

                password,

                officeCode,
              }
            );

          saveUser(
            response.data
          );
        }
      } catch (err) {
        console.error(
          "Authentication error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            (mode ===
            "signin"
              ? "Unable to sign in."
              : "Unable to create account.")
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="ias-login">
      {/* DECORATION */}

      <div className="ias-decoration ias-decoration-one" />

      <div className="ias-decoration ias-decoration-two" />

      {/* =====================
          LEFT SIDE
      ===================== */}

      <section className="ias-story">
        <div className="ias-story-brand">
          <BrandLogo light />
        </div>

        <div className="ias-story-content">
          <div className="ias-pill">
            <Sparkles
              size={15}
            />

            Built for modern
            advisory teams
          </div>

          <h1>
            Smarter compliance.
            <br />

            <span>
              Stronger client
              relationships.
            </span>
          </h1>

          <p className="ias-story-description">
            Manage GST, ITR, TDS,
            ROC/MCA, client
            follow-ups, employee
            tasks and office
            operations from one
            beautifully organised
            workspace.
          </p>

          <div className="ias-benefits">
            <div className="ias-benefit">
              <CheckCircle2 />

              <div>
                <strong>
                  Never miss a
                  due date
                </strong>

                <span>
                  Track every
                  compliance in
                  one organised
                  timeline.
                </span>
              </div>
            </div>

            <div className="ias-benefit">
              <CheckCircle2 />

              <div>
                <strong>
                  Know every
                  client
                </strong>

                <span>
                  CRM details,
                  ownership and
                  follow-ups
                  together.
                </span>
              </div>
            </div>

            <div className="ias-benefit">
              <CheckCircle2 />

              <div>
                <strong>
                  Run the office
                  clearly
                </strong>

                <span>
                  Tasks,
                  attendance and
                  office activity
                  at a glance.
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="ias-story-footer">
          <span>
            PEOPLE
          </span>

          <i />

          <span>
            COMPLIANCE
          </span>

          <i />

          <span>
            PROGRESS
          </span>
        </footer>
      </section>

      {/* =====================
          RIGHT SIDE
      ===================== */}

      <section className="ias-auth-side">
        <div className="ias-auth-card">
          <div className="ias-mobile-logo">
            <BrandLogo />
          </div>

          <span className="ias-secure-label">
            SECURE WORKSPACE
          </span>

          <h2>
            {mode === "signin"
              ? "Welcome back"
              : "Join the workspace"}
          </h2>

          <p className="ias-auth-subtitle">
            {mode === "signin"
              ? "Sign in to your Intime workspace."
              : "Create your employee account securely."}
          </p>

          {/* TABS */}

          <div className="ias-tabs">
            <button
              type="button"
              className={
                mode ===
                "signin"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode(
                  "signin"
                )
              }
            >
              Sign In
            </button>

            <button
              type="button"
              className={
                mode ===
                "signup"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode(
                  "signup"
                )
              }
            >
              Sign Up
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div className="ias-error">
              {error}
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
          >
            {/* SIGNUP NAME */}

            {mode ===
              "signup" && (
              <>
                <div className="ias-field">
                  <label>
                    Full name
                  </label>

                  <div className="ias-input">
                    <UserRound
                      size={19}
                    />

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={
                        name
                      }
                      required
                      onChange={(
                        event
                      ) =>
                        setName(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </div>
                </div>

                {/* DESIGNATION */}

                <div className="ias-field">
                  <label>
                    Designation
                  </label>

                  <div className="ias-input">
                    <BadgeCheck
                      size={19}
                    />

                    <input
                      type="text"
                      placeholder="e.g. Accounts Executive"
                      value={
                        designation
                      }
                      onChange={(
                        event
                      ) =>
                        setDesignation(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL */}

            <div className="ias-field">
              <label>
                Email address
              </label>

              <div className="ias-input">
                <Mail
                  size={19}
                />

                <input
                  type="email"
                  placeholder="name@intimeadvisoryservices.com"
                  value={
                    email
                  }
                  required
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="ias-field">
              <label>
                Password
              </label>

              <div className="ias-input">
                <LockKeyhole
                  size={19}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={
                    password
                  }
                  required
                  minLength={6}
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event
                        .target
                        .value
                    )
                  }
                />

                <button
                  type="button"
                  className="ias-eye-button"
                  aria-label="Show or hide password"
                  onClick={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={19}
                    />
                  ) : (
                    <Eye
                      size={19}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* OFFICE CODE */}

            {mode ===
              "signup" && (
              <div className="ias-field">
                <label>
                  Office access
                  code
                </label>

                <div className="ias-input">
                  <LockKeyhole
                    size={19}
                  />

                  <input
                    type="password"
                    placeholder="Provided by office admin"
                    value={
                      officeCode
                    }
                    required
                    onChange={(
                      event
                    ) =>
                      setOfficeCode(
                        event
                          .target
                          .value
                      )
                    }
                  />
                </div>

                <p className="ias-field-note">
                  New registrations
                  are created only as
                  Employee accounts.
                </p>
              </div>
            )}

            {/* SIGN IN OPTIONS */}

            {mode ===
              "signin" && (
              <div className="ias-login-options">
                <label>
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  Remember me
                </label>

                <span>
                  Office access
                  only
                </span>
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="ias-submit"
              disabled={
                loading
              }
            >
              <span>
                {loading
                  ? mode ===
                    "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode ===
                      "signin"
                    ? "Enter Workspace"
                    : "Create Account"}
              </span>

              <ArrowRight
                size={20}
              />
            </button>
          </form>

          {/* NO ADMIN PASSWORD DISPLAY */}

          <p className="ias-security">
            Protected role-based
            access for Admin &
            Employees
          </p>
        </div>
      </section>
    </main>
  );
}