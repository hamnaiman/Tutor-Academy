import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";

// ADMIN
import adminRoutes from "./routes/adminRoutes.js";

// STUDENT
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import studentRequestRoutes from "./routes/studentRequestRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

// TUTOR
import tutorDashboardRoutes from "./routes/tutorDashboardRoutes.js";
import tutorProfileRoutes from "./routes/tutorProfileRoutes.js";
import tutorPostRoutes from "./routes/tutorPostRoutes.js";
import tutorInteractionRoutes from "./routes/tutorInteractionRoutes.js";

dotenv.config();

/* ================= DATABASE ================= */
connectDB();

const app = express();

/* ================= TRUST PROXY ================= */
app.set("trust proxy", 1);

/* ================= SECURITY HEADERS ================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json({ limit: "10kb" }));

/* ================= SANITIZATION ================= */
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

/* ================= LOGGING ================= */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ================= CORS (MUST BE BEFORE RATE LIMIT) ================= */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Allow preflight requests
app.options("*", cors());

/* ================= RATE LIMITING ================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  // ✅ DO NOT rate-limit preflight requests
  skip: (req) => req.method === "OPTIONS",
});

app.use("/api", limiter);

/* ================= ROUTES ================= */

// AUTH
app.use("/api/auth", authRoutes);

// ADMIN
app.use("/api/admin", adminRoutes);

// STUDENT
app.use("/api/student/dashboard", studentDashboardRoutes);
app.use("/api/student/profile", studentProfileRoutes);
app.use("/api/student/requests", studentRequestRoutes);
app.use("/api/student", studentRoutes);

// TUTOR
app.use("/api/tutor/dashboard", tutorDashboardRoutes);
app.use("/api/tutor/profile", tutorProfileRoutes);
app.use("/api/tutor/posts", tutorPostRoutes);
app.use("/api/tutor/requests", tutorInteractionRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tutor Academy API is running",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
