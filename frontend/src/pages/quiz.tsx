import { useState } from "react";

export default function Quiz() {
  const [level, setLevel] = useState<string>("Beginner");
  const [comfort, setComfort] = useState<string>("Anxious");
  const [preference, setPreference] = useState<string>("Water-based");

  const handleDownload = () => {
    const results = `
NextSwim Analysis
----------------
Date: ${new Date().toLocaleDateString()}
Swim Level: ${level}
Water Comfort: ${comfort}
Exercise Preference: ${preference}

Based on your level (${level}), we recommend ${preference} exercises 
to help you reach your aquatic goals.
    `.trim();

    const blob = new Blob([results], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MySwimLevel.txt";
    link.click();
  };

  return (
    <div className="quiz-page">
      <h1>Swim Level Analysis</h1>
      <p>Answer the questions below to find your level and training path.</p>
      
      <div className="quiz-container">
        {/* Skill Level */}
        <label className="quiz-label">Which best describes your ability?</label>
        <select 
          className="quiz-select"
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="Beginner">Level 1: Beginner (Learning basics)</option>
          <option value="Intermediate">Level 2: Intermediate (Lap swimming)</option>
          <option value="Advanced">Level 3: Advanced (Competitive)</option>
        </select>

        {/* Comfort Level */}
        <label className="quiz-label">How do you feel in deep water?</label>
        <select 
          className="quiz-select"
          value={comfort} 
          onChange={(e) => setComfort(e.target.value)}
        >
          <option value="Anxious">I feel anxious or fearful</option>
          <option value="Neutral">I am okay but cautious</option>
          <option value="Confident">I feel very confident</option>
        </select>

        {/* Exercise Preference (Land or Water) */}
        <label className="quiz-label">What kind of exercises do you prefer?</label>
        <select 
          className="quiz-select"
          value={preference} 
          onChange={(e) => setPreference(e.target.value)}
        >
          <option value="Water-based">In-water (Swimming drills)</option>
          <option value="Land-based">On-land (Strength & Mobility)</option>
          <option value="Hybrid">Both (Land and Water)</option>
        </select>

        <p style={{ margin: '15px 0', fontSize: '0.9rem', color: '#888' }}>
          Current Selection: {level} | {comfort} | {preference}
        </p>

        <button className="quiz-button" onClick={handleDownload}>
          Download Results to View Later
        </button>
      </div>
    </div>
  );
}