require("dotenv").config();
const mysql = require("mysql2/promise");

async function initDb() {
  const host = process.env.DB_HOST || "db";
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "nextswim";

  let connection;
  let authenticated = false;
  let retries = 5;

  // Retry logic ensures the app waits for the Docker database to be ready
  while (!authenticated && retries > 0) {
    try {
      connection = await mysql.createConnection({ host, port, user, password });
      authenticated = true;
    } catch (err) {
      retries--;
      if (retries === 0) {
        console.error("Could not connect to MySQL after multiple attempts.");
        throw err;
      }
      console.log(`MySQL not ready yet, retrying in 2s... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  try {
    // Disable FK checks to allow clean table resets
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.query(`USE \`${database}\``);

    // Drop and Recreate tables to ensure a clean state for testing
    await connection.query("DROP TABLE IF EXISTS goals");
    await connection.query("DROP TABLE IF EXISTS aquatic_resources");
    await connection.query("DROP TABLE IF EXISTS users");

    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        level INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
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

    await connection.query(`
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

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    // Seed data: Required for integration tests to have consistent data to check
    await connection.query(`
      INSERT INTO aquatic_resources (title, resource_type, difficulty_level, description, url)
      VALUES 
      ('Freestyle Stroke Basics', 'Video', 1, 'Beginner breakdown of freestyle.', 'https://www.youtube.com/watch?v=5HLW2AI1Ink'),
      ('Water Safety Basics', 'Article', 1, 'Red Cross foundational safety.', 'https://www.redcross.org/water-safety')
    `);

    console.log("Database initialized and seeded successfully");
  } catch (err) {
    console.error("Database init failed during schema creation:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = initDb;