import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { api } from "../services/api.js";

import {
  Users,
  UserCheck,
  ClipboardCheck,
  ListTodo,
  BriefcaseBusiness,
  ArrowUpRight,
  CalendarClock,
  PhoneCall,
  FileCheck2,
  CheckCircle2,
  Clock3,
  Plus,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";

const serviceTags = [
  "GST Returns",
  "ITR Filing",
  "TDS",
  "ROC / MCA",
  "Bookkeeping",
  "Payroll",
];

export default function Dashboard() {
  const [data, setData] =
    useState({});

  const user = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("user") ||
        "{}"
    );
  }, []);

  const isAdmin =
    user.role === "admin";

  useEffect(() => {
    const load = async () => {
      try {
        const response =
          await api.get(
            "/dashboard"
          );

        setData(response.data);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );
      }
    };

    load();
  }, []);

  const activeRate =
    data.clients > 0
      ? Math.round(
          (Number(
            data.activeClients ||
              0
          ) /
            Number(
              data.clients
            )) *
            100
        )
      : 0;

  const cards = [
    [
      isAdmin
        ? "Total Clients"
        : "My Clients",

      data.clients || 0,

      Users,

      isAdmin
        ? "All client records"
        : "Assigned to you",

      "teal",
    ],

    [
      isAdmin
        ? "Active Clients"
        : "My Active Clients",

      data.activeClients || 0,

      UserCheck,

      `${activeRate}% active`,

      "green",
    ],

    [
      isAdmin
        ? "Pending Compliance"
        : "My Pending Compliance",

      data.pendingCompliances ||
        0,

      ClipboardCheck,

      isAdmin
        ? "Needs attention"
        : "Assigned to you",

      "gold",
    ],

    [
      isAdmin
        ? "Open Tasks"
        : "My Open Tasks",

      data.tasks || 0,

      ListTodo,

      isAdmin
        ? "Across the office"
        : "Assigned to you",

      "violet",
    ],
  ];

  if (
    isAdmin &&
    data.employees !== null &&
    data.employees !==
      undefined
  ) {
    cards.push([
      "Team Members",
      data.employees || 0,
      BriefcaseBusiness,
      "Active employees",
      "blue",
    ]);
  }

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="dashboard-page">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-kicker">
            <Sparkles
              size={14}
            />

            TODAY AT INTIME
          </div>

          <h1>
            {greeting},{" "}
            {user.name?.split(
              " "
            )[0] || "there"}{" "}
            <span>👋</span>
          </h1>

          <p>
            {isAdmin
              ? "Here’s a clear view of your clients, compliance workload and team activity."
              : "Here’s a clear view of your assigned clients, compliance work and tasks."}
          </p>

          <div className="welcome-actions">
            {isAdmin ? (
              <>
                <Link
                  className="primary action-link"
                  to="/clients"
                >
                  <Plus
                    size={17}
                  />

                  Add Client
                </Link>

                <Link
                  className="ghost-link"
                  to="/compliances"
                >
                  View Compliance

                  <ArrowUpRight
                    size={16}
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="primary action-link"
                  to="/clients"
                >
                  <Users
                    size={17}
                  />

                  View My Clients
                </Link>

                <Link
                  className="ghost-link"
                  to="/tasks"
                >
                  View My Tasks

                  <ArrowUpRight
                    size={16}
                  />
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="welcome-visual">
          <div className="visual-ring">
            <div className="visual-ring-inner">
              <b>
                {data.pendingCompliances ||
                  0}
              </b>

              <span>
                pending
              </span>
            </div>
          </div>

          <div className="visual-caption">
            <b>
              Compliance pulse
            </b>

            <span>
              {data.pendingCompliances
                ? isAdmin
                  ? "Keep today’s queue moving"
                  : "Keep your work moving"
                : "You’re all caught up"}
            </span>
          </div>
        </div>

        <span className="banner-glow glow-a" />

        <span className="banner-glow glow-b" />
      </section>

      <div
        className={`stats ${
          cards.length === 5
            ? "five"
            : ""
        }`}
      >
        {cards.map(
          (
            [
              title,
              value,
              Icon,
              subtitle,
              tone,
            ],
            index
          ) => (
            <div
              className={`stat tone-${tone}`}
              key={title}
              style={{
                "--delay": `${
                  index * 70
                }ms`,
              }}
            >
              <div className="stat-top">
                <div className="stat-icon">
                  <Icon />
                </div>

                <span className="live-chip">
                  LIVE
                </span>
              </div>

              <div className="stat-body">
                <span>
                  {title}
                </span>

                <strong>
                  {value}
                </strong>

                <small>
                  {subtitle}
                </small>
              </div>
            </div>
          )
        )}
      </div>

      <div className="dashboard-grid">
        <section className="panel focus-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                WORKFLOW
              </span>

              <h3>
                Today’s focus
              </h3>
            </div>

            <span className="soft-status">
              <span />

              Organised
            </span>
          </div>

          <div className="focus-list">
            <Link to="/compliances">
              <span className="focus-icon gold">
                <CalendarClock />
              </span>

              <span>
                <b>
                  {isAdmin
                    ? "Review due compliances"
                    : "Review my compliance"}
                </b>

                <small>
                  {data.pendingCompliances ||
                    0}{" "}
                  items currently pending
                </small>
              </span>

              <ChevronRight />
            </Link>

            <Link to="/followups">
              <span className="focus-icon teal">
                <PhoneCall />
              </span>

              <span>
                <b>
                  {isAdmin
                    ? "Complete client follow-ups"
                    : "Complete my follow-ups"}
                </b>

                <small>
                  Keep next actions updated
                </small>
              </span>

              <ChevronRight />
            </Link>

            <Link to="/tasks">
              <span className="focus-icon violet">
                <CheckCircle2 />
              </span>

              <span>
                <b>
                  {isAdmin
                    ? "Move open tasks forward"
                    : "Complete my tasks"}
                </b>

                <small>
                  {data.tasks ||
                    0}{" "}
                  tasks are open
                </small>
              </span>

              <ChevronRight />
            </Link>

            <Link to="/clients">
              <span className="focus-icon blue">
                <FileCheck2 />
              </span>

              <span>
                <b>
                  {isAdmin
                    ? "Update client records"
                    : "Review my clients"}
                </b>

                <small>
                  Services and follow-up
                  details
                </small>
              </span>

              <ChevronRight />
            </Link>
          </div>
        </section>

        <section className="panel client-health-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                CRM HEALTH
              </span>

              <h3>
                {isAdmin
                  ? "Client portfolio"
                  : "My client portfolio"}
              </h3>
            </div>

            <Link
              to="/clients"
              className="text-link"
            >
              {isAdmin
                ? "Open CRM"
                : "My Clients"}

              <ArrowUpRight
                size={14}
              />
            </Link>
          </div>

          <div className="health-wrap">
            <div
              className="donut"
              style={{
                "--percent":
                  activeRate,
              }}
            >
              <div>
                <b>
                  {activeRate}%
                </b>

                <span>
                  active
                </span>
              </div>
            </div>

            <div className="health-legend">
              <div>
                <i className="legend-active" />

                <span>
                  <b>
                    {data.activeClients ||
                      0}
                  </b>{" "}
                  Active clients
                </span>
              </div>

              <div>
                <i className="legend-other" />

                <span>
                  <b>
                    {Math.max(
                      0,
                      (data.clients ||
                        0) -
                        (data.activeClients ||
                          0)
                    )}
                  </b>{" "}
                  Leads / other
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel service-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                SERVICES
              </span>

              <h3>
                Core CA workspace
              </h3>
            </div>

            <Building2
              size={20}
            />
          </div>

          <div className="service-cloud">
            {serviceTags.map(
              (
                service,
                index
              ) => (
                <span
                  key={service}
                  style={{
                    "--i":
                      index,
                  }}
                >
                  {service}
                </span>
              )
            )}
          </div>

          <div className="service-note">
            <Clock3
              size={17}
            />

            <span>
              <b>
                Designed around
                recurring deadlines
              </b>

              <small>
                Track monthly,
                quarterly and annual
                work.
              </small>
            </span>
          </div>
        </section>

        <section className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                SHORTCUTS
              </span>

              <h3>
                Quick actions
              </h3>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/clients">
              <Users />

              <span>
                {isAdmin
                  ? "Client CRM"
                  : "My Clients"}
              </span>

              <ChevronRight />
            </Link>

            <Link to="/compliances">
              <ClipboardCheck />

              <span>
                {isAdmin
                  ? "Compliance"
                  : "My Compliance"}
              </span>

              <ChevronRight />
            </Link>

            <Link to="/tasks">
              <ListTodo />

              <span>
                {isAdmin
                  ? "Tasks"
                  : "My Tasks"}
              </span>

              <ChevronRight />
            </Link>

            {isAdmin && (
              <Link to="/employees">
                <BriefcaseBusiness />

                <span>
                  Employees
                </span>

                <ChevronRight />
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}