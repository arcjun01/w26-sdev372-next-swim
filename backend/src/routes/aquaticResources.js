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

//post route to create new resources
router.post("/", async (req, res) => {
  const { title, resource_type, difficulty_level, description, url } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO aquatic_resources (title, resource_type, difficulty_level, description, url) VALUES (?, ?, ?, ?, ?)",
      [title, resource_type, difficulty_level, description, url]
    );
    
    // Return the new resource with its ID
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      resource_type, 
      difficulty_level, 
      description, 
      url 
    });
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({ error: "Failed to add resource" });
  }
});


module.exports = router;
