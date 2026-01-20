// backend/app.js
const express = require("express");
const cors = require("cors");

const aquaticResourcesRoutes = require("./src/routes/aquaticResources");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/aquatic-resources", aquaticResourcesRoutes);

// Health check route
app.get("/api/swim", (req, res) => {
  res.json({ status: "Backend is running" });
});

module.exports = app;
