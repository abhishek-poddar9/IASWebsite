import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import complianceRoutes from "./routes/compliances.js";
import taskRoutes from "./routes/tasks.js";
import followUpRoutes from "./routes/followups.js";
import attendanceRoutes from "./routes/attendance.js";
import expenseRoutes from "./routes/expenses.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

await connectDB();

const app = express();

/* =========================================
   CORS
========================================= */

const allowedOrigins = [
  "https://iaswebsite-client.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      /*
        Postman/server-to-server requests
        me origin missing ho sakta hai.
      */
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `Origin not allowed by CORS: ${origin}`
        )
      );
    },

    credentials: true,
  })
);

/* =========================================
   BODY PARSER
========================================= */

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   HEALTH CHECK
========================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      status: "ok",
      service:
        "Intime Advisory Services API",
    });
  }
);

/* =========================================
   API ROUTES
========================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/clients",
  clientRoutes
);

app.use(
  "/api/compliances",
  complianceRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/followups",
  followUpRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/expenses",
  expenseRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

/* =========================================
   404
========================================= */

app.use((req, res) => {
  res.status(404).json({
    message:
      "API route not found",
  });
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "SERVER ERROR:",
      error
    );

    res.status(500).json({
      message:
        process.env.NODE_ENV ===
        "production"
          ? "Internal server error"
          : error.message ||
            "Server error",
    });
  }
);

/* =========================================
   SERVER
========================================= */

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);
