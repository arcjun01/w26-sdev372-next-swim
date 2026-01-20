// backend/config/initDB.js
const pool = require("./db");

async function initDb() {
  try {
    // Disable FK checks for resets
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    await pool.query("CREATE DATABASE IF NOT EXISTS nextswim");
    await pool.query("USE nextswim");

    // Drop tables if they exist
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
    throw err;
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


/*
populate tables with test data:

users:
INSERT INTO users (email, password_hash, level)
VALUES
  ('alex@example.com', '$2b$10$hashedpassword1', 1),
  ('jamie@example.com', '$2b$10$hashedpassword2', 2),
  ('taylor@example.com', '$2b$10$hashedpassword3', 3);

  goals:
  INSERT INTO goals (user_id, title, description, is_completed)
VALUES
  (
    1,
    'Learn basic water safety',
    'Understand pool rules and basic water safety concepts.',
    FALSE
  ),
  (
    2,
    'Improve freestyle technique',
    'Practice proper breathing and arm movement.',
    FALSE
  ),
  (
    3,
    'Pass lifeguard rescue assessment',
    'Successfully complete advanced rescue scenarios.',
    TRUE
  );



  RESOURCES REAL DATA:
INSERT INTO aquatic_resources
(title, resource_type, difficulty_level, description, url)
VALUES
-- STROKE TECHNIQUE -------------------------------------------------
('Freestyle Stroke Basics', 'Video', 1, 'Beginner breakdown of freestyle body position, kick, and breathing.', 'https://www.youtube.com/watch?v=5HLW2AI1Ink'),
('Freestyle Catch and Pull Technique', 'Article', 3, 'Detailed explanation of the freestyle catch phase and underwater pull.', 'https://www.usaswimming.org/coaches/popular-resources/freestyle-technique'),
('Backstroke Fundamentals', 'Video', 1, 'Introductory backstroke lesson focusing on body alignment and rotation.', 'https://www.youtube.com/watch?v=7Lk8ZzD9k1E'),
('Breaststroke Timing Explained', 'Video', 2, 'Explains proper breaststroke timing and glide.', 'https://www.youtube.com/watch?v=EElzlIMjk_c'),
('Butterfly Stroke for Beginners', 'Article', 3, 'Step-by-step butterfly progression for newer swimmers.', 'https://www.swimming.org/learn-to-swim/butterfly-stroke/'),
('Improving Flip Turns', 'Video', 3, 'Technique tips for faster and more controlled flip turns.', 'https://www.youtube.com/watch?v=QmKzRzP9E2A'),
('Underwater Dolphin Kick Drills', 'Video', 4, 'Advanced dolphin kick drills used by competitive swimmers.', 'https://www.youtube.com/watch?v=8xF1Yv3YkFc'),
('Common Stroke Mistakes', 'Article', 2, 'Overview of frequent technique errors across all four strokes.', 'https://www.swimmingworldmagazine.com/news/common-swimming-mistakes/'),

-- WATER SAFETY -----------------------------------------------------
('Red Cross Water Safety Basics', 'Article', 1, 'Foundational water safety principles from the American Red Cross.', 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/water-safety.html'),
('Reach or Throw, Don’t Go', 'Video', 1, 'Teaches safe rescue principles without endangering yourself.', 'https://www.youtube.com/watch?v=K6KZ8zA3k7E'),
('Cold Water Shock Awareness', 'Article', 2, 'Explains the dangers and physiological response to cold water immersion.', 'https://www.rlss.org.uk/cold-water-shock'),
('Rip Current Safety', 'Article', 1, 'How to identify and escape rip currents safely.', 'https://www.weather.gov/safety/ripcurrent'),
('Pool Safety for Children', 'Article', 1, 'Guidelines for preventing childhood drowning.', 'https://www.cdc.gov/drowning/prevention/index.html'),
('Open Water Swimming Safety', 'Video', 3, 'Safety considerations for lakes, rivers, and oceans.', 'https://www.youtube.com/watch?v=Fz6p6tZ6ZkU'),

-- LIFEGUARDING -----------------------------------------------------
('Scanning Techniques for Lifeguards', 'Article', 2, 'Explains systematic scanning strategies to prevent missed victims.', 'https://www.aquaticsintl.com/facilities/scanning-techniques_o'),
('Recognizing Active vs Passive Drowning', 'Article', 2, 'Key differences between active and passive drowning victims.', 'https://www.lifeguardtraining.com/blogs/news/active-vs-passive-drowning'),
('Lifeguard Rescue Tube Use', 'Video', 2, 'Demonstrates proper rescue tube handling and victim approach.', 'https://www.youtube.com/watch?v=R4sF8u7f9kA'),
('In-Service Lifeguard Training Drills', 'Article', 3, 'Ideas for effective ongoing lifeguard training.', 'https://www.aquaticsintl.com/facilities/in-service-training-drills_o'),
('CPR for the Professional Rescuer Overview', 'Course', 2, 'Overview of CPR standards used by professional rescuers.', 'https://www.redcross.org/take-a-class/cpr'),

-- SWIM SKILLS & LEARNING ------------------------------------------
('How to Float on Your Back', 'Video', 1, 'Beginner-friendly explanation of back floating.', 'https://www.youtube.com/watch?v=6CkzFv4v2zM'),
('Treading Water Techniques', 'Video', 2, 'Eggbeater and scissor kick methods for treading water.', 'https://www.youtube.com/watch?v=J7yXkYzYz6E'),
('Learning to Breathe While Swimming', 'Article', 1, 'Addresses common breathing challenges for new swimmers.', 'https://www.swimoutlet.com/blogs/guides/how-to-breathe-while-swimming'),
('Kickboard Drills for Beginners', 'Article', 1, 'Simple kickboard drills to build leg strength and confidence.', 'https://www.swimming.org/learn-to-swim/kickboard-drills/'),
('Improving Endurance in Swimming', 'Article', 3, 'Training concepts for building swim endurance.', 'https://www.swimmingworldmagazine.com/news/how-to-improve-swimming-endurance/'),

-- CALMING ANXIETY & WATER CONFIDENCE -------------------------------
('Overcoming Fear of Water', 'Article', 1, 'Practical steps to reduce anxiety and build water confidence.', 'https://www.swimming.org/learn-to-swim/fear-of-water/'),
('How to Relax While Swimming', 'Video', 1, 'Breathing and relaxation techniques for anxious swimmers.', 'https://www.youtube.com/watch?v=4U7y2zZpF8M'),
('Adult Learn-to-Swim Guide', 'Article', 1, 'Encouragement and guidance for adults learning to swim.', 'https://www.usaswimming.org/learn-to-swim/adult-learn-to-swim'),
('Mindfulness for Aquatic Anxiety', 'Article', 2, 'How mindfulness techniques can help reduce water-related anxiety.', 'https://www.psychologytoday.com/us/blog/mindfulness-in-frantic-world/201907/mindfulness-anxiety'),
('Breathing Exercises for Calm', 'Article', 1, 'Simple breathing exercises to control panic and stress.', 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/deep-breathing/art-20044268'),

-- BOOKS & LONG-FORM -----------------------------------------------
('Total Immersion Swimming', 'Book', 3, 'Popular book focused on efficient, low-effort swimming technique.', 'https://www.totalimmersion.net/'),
('Swimming Anatomy', 'Book', 4, 'In-depth look at the muscles used in swimming.', 'https://us.humankinetics.com/products/swimming-anatomy'),
('The Complete Guide to Swimming', 'Book', 2, 'Comprehensive guide covering strokes, safety, and training.', 'https://www.dk.com/us/book/9781465459753-the-complete-guide-to-swimming/'),
('USA Swimming Skills Resource Library', 'Article', 2, 'Collection of skill development resources from USA Swimming.', 'https://www.usaswimming.org/coaches/resource-library'),
('Swim England Learn to Swim Framework', 'Article', 2, 'Structured swim progression framework used in the UK.', 'https://www.swimming.org/learn-to-swim/learn-to-swim-framework/');



*/

