const pool = require("./db");

async function initDb() {
  try {
    // Disable FK checks for resets
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    await pool.query("CREATE DATABASE IF NOT EXISTS nextswim");
    await pool.query("USE nextswim");

    // Drop tables
    await pool.query("DROP TABLE IF EXISTS user_resources");
    await pool.query("DROP TABLE IF EXISTS goals");
    await pool.query("DROP TABLE IF EXISTS aquatic_resources");
    await pool.query("DROP TABLE IF EXISTS users");

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        level INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create goals table
    await pool.query(`
      CREATE TABLE goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create aquatic_resources table
    await pool.query(`
      CREATE TABLE aquatic_resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        resource_type VARCHAR(100),
        difficulty_level INT,
        description TEXT,
        url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database init failed:", err);
  }
}

module.exports = initDb;


/*
Impliment this next, but use current set up for now

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "nextswim"
});

*/

