// backend/routes/aquaticResources.js
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET all aquatic resources
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM aquatic_resources");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch aquatic resources" });
  }
});

module.exports = router;
