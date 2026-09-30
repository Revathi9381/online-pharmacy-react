const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

// Configure DNS resolver fallback only if connecting to MongoDB Atlas SRV URI
if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith("mongodb+srv://")) {
  const dns = require("dns");
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (e) {}
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const orderRoutes = require("./routes/orderroutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const historyRoutes = require("./routes/historyRoutes");
const caretakerRoutes = require("./routes/caretakerRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// ================= CORS CONFIGURATION =================
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, serverless same-origin, curl, Postman)
    if (!origin) return callback(null, true);

    // If explicit wildcard or matches allowed origins or Vercel preview URLs
    if (
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes("*") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    // Default allow for local dev
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.use(express.json());

// ================= MONGODB CACHED CONNECTION (SERVERLESS READY) =================
let cachedConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    console.warn("WARNING: MONGO_URI is not set in environment variables");
    return null;
  }

  if (!cachedConnectionPromise) {
    console.log("MongoDB connecting...");
    cachedConnectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        console.log("MongoDB connected successfully");
        return m;
      })
      .catch((error) => {
        cachedConnectionPromise = null;
        console.error("MongoDB connection failed:", error.message || error);
        throw error;
      });
  }

  return cachedConnectionPromise;
};

// Initiate connection on server startup
connectDB().catch(() => {});

// Middleware to ensure database is connected before handling requests
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1 && process.env.MONGO_URI) {
    try {
      await connectDB();
    } catch (dbErr) {
      console.error("Database connection middleware error:", dbErr.message);
    }
  }
  next();
});

// ================= ROUTE MOUNTING =================
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/caretakers", caretakerRoutes);
app.use("/api/caretaker", caretakerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contacts", contactRoutes);

// ================= TEST / HEALTH ROUTE =================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Online Pharmacy Backend is running",
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1
  });
});

// ================= ERROR HANDLING MIDDLEWARE =================
app.use((err, req, res, next) => {
  console.error("Express error handler caught:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

// ================= LOCAL SERVER STARTUP =================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ================= VERCEL SERVERLESS EXPORT =================
module.exports = app;