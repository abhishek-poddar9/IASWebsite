import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ListTodo,
  UserCog,
  Clock3,
  PhoneCall,
  Wallet,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileText,
} from "lucide-react";

import BrandLogo from "./BrandLogo.jsx";
import { api } from "../services/api.js";

/* =========================================================
   NAVIGATION
========================================================= */

const adminNavigation = [
  ["/", "Dashboard", LayoutDashboard],
  ["/clients", "Clients & CRM", Users],
  ["/compliances", "Compliance", ClipboardCheck],
  ["/tasks", "Tasks", ListTodo],
  ["/followups", "Follow-ups", PhoneCall],
  ["/attendance", "Attendance", Clock3],
  ["/employees", "Employees", UserCog],
  ["/expenses", "Expenses", Wallet],
];

const employeeNavigation = [
  ["/", "Dashboard", LayoutDashboard],
  ["/clients", "My Clients", Users],
  ["/compliances", "My Compliance", ClipboardCheck],
  ["/tasks", "My Tasks", ListTodo],
  ["/followups", "My Follow-ups", PhoneCall],
  ["/attendance", "My Attendance", Clock3],
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const startOfDay = (date = new Date()) => {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  return value;
};

const differenceInDays = (date) => {
  const today = startOfDay();

  const target = startOfDay(
    new Date(date)
  );

  return Math.ceil(
    (target.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

const formatShortDate = (date) => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  ).format(new Date(date));
};

const includesText = (
  value,
  query
) => {
  return String(value || "")
    .toLowerCase()
    .includes(
      String(query || "").toLowerCase()
    );
};

/* =========================================================
   LAYOUT
========================================================= */

export default function Layout() {
  const navigate = useNavigate();

  const searchInputRef =
    useRef(null);

  const notificationRef =
    useRef(null);

  const bellRef =
    useRef(null);

  /* =============================
     USER
  ============================= */

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
          "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const isAdmin =
    user.role === "admin";

  const items = useMemo(() => {
    return isAdmin
      ? adminNavigation
      : employeeNavigation;
  }, [isAdmin]);

  /* =============================
     STATES
  ============================= */

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [query, setQuery] =
    useState("");

  const [
    workspaceLoading,
    setWorkspaceLoading,
  ] = useState(false);

  const [clients, setClients] =
    useState([]);

  const [
    compliances,
    setCompliances,
  ] = useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [
    followUps,
    setFollowUps,
  ] = useState([]);

  const [
    readNotificationIds,
    setReadNotificationIds,
  ] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "ias_notification_read_ids"
        ) || "[]"
      );
    } catch {
      return [];
    }
  });

  /* =============================
     CURRENT DATE
  ============================= */

  const today =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    ).format(new Date());

  /* =============================
     LOGOUT
  ============================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =========================================================
     LOAD SEARCH / NOTIFICATION DATA
  ========================================================= */

  const loadWorkspaceData =
    async () => {
      setWorkspaceLoading(true);

      try {
        const results =
          await Promise.allSettled([
            api.get("/clients"),
            api.get("/compliances"),
            api.get("/tasks"),
            api.get("/followups"),
          ]);

        if (
          results[0].status ===
          "fulfilled"
        ) {
          setClients(
            Array.isArray(
              results[0].value.data
            )
              ? results[0].value.data
              : []
          );
        }

        if (
          results[1].status ===
          "fulfilled"
        ) {
          setCompliances(
            Array.isArray(
              results[1].value.data
            )
              ? results[1].value.data
              : []
          );
        }

        if (
          results[2].status ===
          "fulfilled"
        ) {
          setTasks(
            Array.isArray(
              results[2].value.data
            )
              ? results[2].value.data
              : []
          );
        }

        if (
          results[3].status ===
          "fulfilled"
        ) {
          setFollowUps(
            Array.isArray(
              results[3].value.data
            )
              ? results[3].value.data
              : []
          );
        }
      } catch (error) {
        console.error(
          "Workspace load error:",
          error
        );
      } finally {
        setWorkspaceLoading(false);
      }
    };

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  /* =========================================================
     CTRL + K SEARCH SHORTCUT
  ========================================================= */

  useEffect(() => {
    const handleKeyboard = (
      event
    ) => {
      const isSearchShortcut =
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k";

      if (isSearchShortcut) {
        event.preventDefault();

        setNotificationOpen(false);
        setSearchOpen(true);

        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }

      if (
        event.key === "Escape"
      ) {
        setSearchOpen(false);
        setNotificationOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  /* =========================================================
     NOTIFICATION OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (!notificationOpen) {
        return;
      }

      const insideNotifications =
        notificationRef.current?.contains(
          event.target
        );

      const insideBell =
        bellRef.current?.contains(
          event.target
        );

      if (
        !insideNotifications &&
        !insideBell
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [notificationOpen]);

  /* =========================================================
     SEARCH RESULTS
  ========================================================= */

  const searchResults =
    useMemo(() => {
      const q =
        query.trim().toLowerCase();

      if (!q) {
        return [];
      }

      const results = [];

      /* -------------------------
         MODULES
      ------------------------- */

      items.forEach(
        ([route, label, Icon]) => {
          if (
            includesText(
              label,
              q
            )
          ) {
            results.push({
              id: `module-${route}`,
              type: "Module",
              title: label,
              subtitle:
                "Open workspace module",
              route,
              Icon,
            });
          }
        }
      );

      /* -------------------------
         CLIENTS
      ------------------------- */

      clients.forEach(
        (client) => {
          const values = [
            client.name,
            client.clientCode,
            client.pan,
            client.gstin,
            client.tan,
            client.email,
            client.phone,
            client.status,
            ...(client.services ||
              []),
          ];

          const matched =
            values.some((value) =>
              includesText(
                value,
                q
              )
            );

          if (matched) {
            results.push({
              id: `client-${client._id}`,

              type: "Client",

              title:
                client.name ||
                "Client",

              subtitle:
                client.clientCode ||
                client.phone ||
                "Client record",

              route: "/clients",

              Icon: Users,
            });
          }
        }
      );

      /* -------------------------
         COMPLIANCE
      ------------------------- */

      compliances.forEach(
        (item) => {
          const values = [
            item.service,
            item.period,
            item.status,
            item.computedStatus,
            item.client?.name,
            item.client
              ?.clientCode,
          ];

          const matched =
            values.some((value) =>
              includesText(
                value,
                q
              )
            );

          if (matched) {
            results.push({
              id: `compliance-${item._id}`,

              type: "Compliance",

              title:
                item.service ||
                "Compliance",

              subtitle: `${
                item.client?.name ||
                "Client"
              }${
                item.dueDate
                  ? ` · ${formatShortDate(
                      item.dueDate
                    )}`
                  : ""
              }`,

              route:
                "/compliances",

              Icon:
                ClipboardCheck,
            });
          }
        }
      );

      /* -------------------------
         TASKS
      ------------------------- */

      tasks.forEach((task) => {
        const values = [
          task.title,
          task.description,
          task.priority,
          task.status,
          task.client?.name,
          task.assignedTo?.name,
        ];

        const matched =
          values.some((value) =>
            includesText(
              value,
              q
            )
          );

        if (matched) {
          results.push({
            id: `task-${task._id}`,

            type: "Task",

            title:
              task.title ||
              "Task",

            subtitle: `${
              task.status ||
              "No status"
            }${
              task.priority
                ? ` · ${task.priority}`
                : ""
            }`,

            route: "/tasks",

            Icon: ListTodo,
          });
        }
      });

      /* -------------------------
         FOLLOW UPS
      ------------------------- */

      followUps.forEach(
        (item) => {
          const values = [
            item.client?.name,
            item.mode,
            item.summary,
            item.outcome,
            item.employee?.name,
          ];

          const matched =
            values.some((value) =>
              includesText(
                value,
                q
              )
            );

          if (matched) {
            results.push({
              id: `follow-${item._id}`,

              type: "Follow-up",

              title:
                item.client?.name ||
                "Client Follow-up",

              subtitle:
                item.summary ||
                item.mode ||
                "Follow-up",

              route:
                "/followups",

              Icon: PhoneCall,
            });
          }
        }
      );

      return results.slice(
        0,
        12
      );
    }, [
      query,
      items,
      clients,
      compliances,
      tasks,
      followUps,
    ]);

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const notifications =
    useMemo(() => {
      const list = [];

      /* -------------------------
         COMPLIANCE
      ------------------------- */

      compliances.forEach(
        (item) => {
          if (!item.dueDate) {
            return;
          }

          const completed =
            [
              "Filed",
              "Completed",
            ].includes(
              item.status
            );

          if (completed) {
            return;
          }

          const days =
            differenceInDays(
              item.dueDate
            );

          if (days < 0) {
            list.push({
              id: `compliance-overdue-${item._id}-${item.dueDate}`,

              type: "danger",

              title:
                "Compliance overdue",

              message: `${
                item.client?.name ||
                "Client"
              } · ${
                item.service ||
                "Compliance"
              }`,

              date:
                item.dueDate,

              route:
                "/compliances",

              Icon:
                AlertTriangle,
            });

            return;
          }

          if (days <= 7) {
            list.push({
              id: `compliance-due-${item._id}-${item.dueDate}`,

              type:
                days <= 1
                  ? "warning"
                  : "info",

              title:
                days === 0
                  ? "Compliance due today"
                  : "Compliance due soon",

              message: `${
                item.client?.name ||
                "Client"
              } · ${
                item.service ||
                "Compliance"
              }`,

              date:
                item.dueDate,

              route:
                "/compliances",

              Icon:
                CalendarClock,
            });
          }
        }
      );

      /* -------------------------
         TASKS
      ------------------------- */

      tasks.forEach((task) => {
        if (
          !task.dueDate ||
          task.status === "Done"
        ) {
          return;
        }

        const days =
          differenceInDays(
            task.dueDate
          );

        if (days <= 3) {
          list.push({
            id: `task-${task._id}-${task.dueDate}`,

            type:
              days < 0
                ? "danger"
                : "info",

            title:
              days < 0
                ? "Task overdue"
                : days === 0
                  ? "Task due today"
                  : "Task due soon",

            message:
              task.title ||
              "Task",

            date:
              task.dueDate,

            route: "/tasks",

            Icon: ListTodo,
          });
        }
      });

      /* -------------------------
         FOLLOW UPS
      ------------------------- */

      followUps.forEach(
        (item) => {
          if (
            !item.nextFollowUp
          ) {
            return;
          }

          const days =
            differenceInDays(
              item.nextFollowUp
            );

          if (
            days >= 0 &&
            days <= 3
          ) {
            list.push({
              id: `follow-${item._id}-${item.nextFollowUp}`,

              type:
                "success",

              title:
                days === 0
                  ? "Follow-up today"
                  : "Upcoming follow-up",

              message:
                item.client?.name ||
                "Client",

              date:
                item.nextFollowUp,

              route:
                "/followups",

              Icon: PhoneCall,
            });
          }
        }
      );

      return list
        .sort((a, b) => {
          return (
            new Date(a.date) -
            new Date(b.date)
          );
        })
        .slice(0, 20);
    }, [
      compliances,
      tasks,
      followUps,
    ]);

  /* =========================================================
     UNREAD NOTIFICATION COUNT
  ========================================================= */

  const unreadCount =
    notifications.filter(
      (item) =>
        !readNotificationIds.includes(
          item.id
        )
    ).length;

  /* =========================================================
     NOTIFICATION FUNCTIONS
  ========================================================= */

  const saveReadNotifications = (
    ids
  ) => {
    const uniqueIds = [
      ...new Set(ids),
    ];

    setReadNotificationIds(
      uniqueIds
    );

    localStorage.setItem(
      "ias_notification_read_ids",
      JSON.stringify(
        uniqueIds
      )
    );
  };

  const markAllRead = () => {
    saveReadNotifications([
      ...readNotificationIds,

      ...notifications.map(
        (item) => item.id
      ),
    ]);
  };

  const openNotification = (
    notification
  ) => {
    if (
      !readNotificationIds.includes(
        notification.id
      )
    ) {
      saveReadNotifications([
        ...readNotificationIds,
        notification.id,
      ]);
    }

    setNotificationOpen(false);

    navigate(
      notification.route
    );
  };

  /* =========================================================
     SEARCH FUNCTIONS
  ========================================================= */

  const openSearch = () => {
    setNotificationOpen(false);

    setSearchOpen(true);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const openSearchResult = (
    result
  ) => {
    navigate(result.route);

    closeSearch();

    setMobileOpen(false);
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div
      className={`shell ${
        mobileOpen
          ? "menu-open"
          : ""
      }`}
    >
      {/* ===========================
          MOBILE BUTTON
      =========================== */}

      <button
        type="button"
        className="mobile-menu-btn"
        aria-label="Toggle menu"
        onClick={() =>
          setMobileOpen(
            (value) => !value
          )
        }
      >
        {mobileOpen ? (
          <X />
        ) : (
          <Menu />
        )}
      </button>

      {/* ===========================
          SIDEBAR
      =========================== */}

      <aside className="sidebar">
        <div className="side-brand">
          <BrandLogo light />

          <span className="brand-shimmer" />
        </div>

        <div className="workspace-label">
          <Sparkles size={13} />

          WORKSPACE
        </div>

        <nav>
          {items.map(
            ([
              path,
              label,
              Icon,
            ]) => (
              <NavLink
                key={path}
                to={path}
                end={
                  path === "/"
                }
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                <Icon
                  size={18}
                />

                <span>
                  {label}
                </span>

                <ChevronRight
                  className="nav-arrow"
                  size={14}
                />
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-note">
          <span className="note-dot" />

          <div>
            <b>
              Compliance made simple
            </b>

            <p>
              One workspace for every
              client deadline.
            </p>
          </div>
        </div>

        <div className="side-user">
          <div className="user-avatar">
            {user.name
              ?.split(" ")
              .map(
                (part) =>
                  part[0]
              )
              .slice(0, 2)
              .join("")
              .toUpperCase() ||
              "IA"}
          </div>

          <div className="user-meta">
            <b>
              {user.name ||
                "Team Member"}
            </b>

            <span>
              {isAdmin
                ? "Admin · Partner View"
                : "Employee View"}
            </span>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={logout}
            title="Logout"
          >
            <LogOut
              size={18}
            />
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      {/* ===========================
          MAIN
      =========================== */}

      <main className="main">
        {/* =========================
            TOP BAR
        ========================= */}

        <header className="topbar">
          <div className="topbar-title">
            <span className="eyebrow">
              INTIME ADVISORY SERVICES
            </span>

            <h2>
              Office Management & CRM
            </h2>
          </div>

          <div className="topbar-actions">
            {/* SEARCH */}

            <button
              type="button"
              className="top-search"
              onClick={openSearch}
              title="Search workspace"
            >
              <Search
                size={16}
              />

              <span>
                Search workspace
              </span>

              <kbd>
                Ctrl K
              </kbd>
            </button>

            {/* DATE */}

            <div className="date-chip">
              {today}
            </div>

            {/* NOTIFICATION BELL */}

            <button
              ref={bellRef}
              type="button"
              className={`round-action ${
                notificationOpen
                  ? "active"
                  : ""
              }`}
              aria-label="Notifications"
              onClick={() => {
                setSearchOpen(false);

                setNotificationOpen(
                  (value) =>
                    !value
                );
              }}
            >
              <Bell
                size={17}
              />

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* AVATAR */}

            <div
              className="top-avatar"
              title={
                user.name ||
                "Intime User"
              }
            >
              {user.name?.[0]?.toUpperCase() ||
                "I"}
            </div>

            {/* =========================
                NOTIFICATION POPOVER
            ========================= */}

            {notificationOpen && (
              <div
                ref={
                  notificationRef
                }
                className="notification-popover"
              >
                <div className="notification-header">
                  <div>
                    <span className="section-kicker">
                      ACTIVITY
                    </span>

                    <h3>
                      Notifications
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="notification-refresh"
                    title="Refresh notifications"
                    onClick={
                      loadWorkspaceData
                    }
                  >
                    <RefreshCw
                      size={15}
                      className={
                        workspaceLoading
                          ? "spin"
                          : ""
                      }
                    />
                  </button>
                </div>

                <div className="notification-toolbar">
                  <span>
                    {unreadCount === 0
                      ? "You're all caught up"
                      : `${unreadCount} unread`}
                  </span>

                  {unreadCount >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        markAllRead
                      }
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notification-list">
                  {workspaceLoading &&
                  notifications.length ===
                    0 ? (
                    <div className="notification-empty">
                      <RefreshCw
                        className="spin"
                        size={22}
                      />

                      <b>
                        Checking activity...
                      </b>
                    </div>
                  ) : notifications.length ===
                    0 ? (
                    <div className="notification-empty">
                      <CheckCircle2
                        size={25}
                      />

                      <b>
                        No urgent
                        notifications
                      </b>

                      <span>
                        Upcoming
                        compliance,
                        tasks and
                        follow-ups
                        will appear
                        here.
                      </span>
                    </div>
                  ) : (
                    notifications.map(
                      (
                        notification
                      ) => {
                        const Icon =
                          notification.Icon;

                        const isUnread =
                          !readNotificationIds.includes(
                            notification.id
                          );

                        return (
                          <button
                            type="button"
                            key={
                              notification.id
                            }
                            className={`notification-item ${
                              isUnread
                                ? "unread"
                                : ""
                            }`}
                            onClick={() =>
                              openNotification(
                                notification
                              )
                            }
                          >
                            <span
                              className={`notification-icon ${notification.type}`}
                            >
                              <Icon
                                size={16}
                              />
                            </span>

                            <span className="notification-copy">
                              <b>
                                {
                                  notification.title
                                }
                              </b>

                              <small>
                                {
                                  notification.message
                                }
                              </small>

                              <em>
                                {formatShortDate(
                                  notification.date
                                )}
                              </em>
                            </span>

                            <ChevronRight
                              size={14}
                            />
                          </button>
                        );
                      }
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ===========================
            PAGE CONTENT
        =========================== */}

        <section className="content">
          <Outlet />
        </section>
      </main>

      {/* =====================================================
          GLOBAL SEARCH POPUP
      ===================================================== */}

      {searchOpen && (
        <div
          className="workspace-search-backdrop"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeSearch();
            }
          }}
        >
          <div className="workspace-search-modal">
            {/* SEARCH INPUT */}

            <div className="workspace-search-input">
              <Search
                size={20}
              />

              <input
                ref={
                  searchInputRef
                }
                type="text"
                value={query}
                placeholder={
                  isAdmin
                    ? "Search clients, compliance, tasks, follow-ups..."
                    : "Search my clients, compliance, tasks..."
                }
                onChange={(
                  event
                ) =>
                  setQuery(
                    event.target
                      .value
                  )
                }
              />

              <button
                type="button"
                onClick={
                  closeSearch
                }
                title="Close search"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* INITIAL SEARCH SCREEN */}

            {!query.trim() ? (
              <div className="search-start">
                <div className="search-start-icon">
                  <Search
                    size={24}
                  />
                </div>

                <h3>
                  Search your workspace
                </h3>

                <p>
                  {isAdmin
                    ? "Search clients, compliance, tasks, follow-ups or open any module."
                    : "Search only clients, compliance, tasks and follow-ups assigned to you."}
                </p>

                <div className="search-shortcuts">
                  {items
                    .slice(0, 6)
                    .map(
                      ([
                        route,
                        label,
                        Icon,
                      ]) => (
                        <button
                          type="button"
                          key={
                            route
                          }
                          onClick={() =>
                            openSearchResult(
                              {
                                route,
                              }
                            )
                          }
                        >
                          <Icon
                            size={15}
                          />

                          {label}
                        </button>
                      )
                    )}
                </div>
              </div>
            ) : workspaceLoading ? (
              /* LOADING */

              <div className="search-state">
                <RefreshCw
                  className="spin"
                  size={21}
                />

                <b>
                  Searching workspace...
                </b>
              </div>
            ) : searchResults.length ===
              0 ? (
              /* NO RESULT */

              <div className="search-state">
                <FileText
                  size={23}
                />

                <b>
                  No matching results
                </b>

                <span>
                  Try searching by client
                  name, client code,
                  service or task title.
                </span>
              </div>
            ) : (
              /* RESULTS */

              <div className="search-results">
                <div className="search-result-title">
                  {
                    searchResults.length
                  }{" "}
                  result
                  {searchResults.length ===
                  1
                    ? ""
                    : "s"}
                </div>

                {searchResults.map(
                  (result) => {
                    const Icon =
                      result.Icon ||
                      Search;

                    return (
                      <button
                        type="button"
                        key={
                          result.id
                        }
                        className="search-result"
                        onClick={() =>
                          openSearchResult(
                            result
                          )
                        }
                      >
                        <span className="search-result-icon">
                          <Icon
                            size={17}
                          />
                        </span>

                        <span className="search-result-copy">
                          <b>
                            {
                              result.title
                            }
                          </b>

                          <small>
                            {
                              result.subtitle
                            }
                          </small>
                        </span>

                        <span className="search-result-type">
                          {
                            result.type
                          }
                        </span>

                        <ChevronRight
                          size={15}
                        />
                      </button>
                    );
                  }
                )}
              </div>
            )}

            <div className="search-footer">
              <span>
                <kbd>
                  Esc
                </kbd>{" "}
                Close
              </span>

              <span>
                {isAdmin
                  ? "Office Workspace Search"
                  : "My Workspace Search"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}