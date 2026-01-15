const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route (important for verifying frontend ↔ backend)
app.get("/api/swim", (req, res) => {
  res.json({ status: "Backend is running" });
});

module.exports = app;
