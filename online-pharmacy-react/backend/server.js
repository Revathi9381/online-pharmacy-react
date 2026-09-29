const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
    res.send("Online Pharmacy Backend is running");
});

// ================= START SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});