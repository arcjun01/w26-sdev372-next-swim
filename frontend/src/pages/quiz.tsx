import { useState } from "react";

export default function Quiz() {
  const [level, setLevel] = useState<string>("Beginner");

    const handleDownload = () => {
    const results = `NextSwim Results\nLevel: ${level}\nDate: ${new Date().toLocaleDateString()}`;
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
      <p>Answer the questions below to find your level.</p>
      
      <div className="quiz-container">
        <select 
          className="quiz-select"
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="Beginner">Level 1: Beginner</option>
          <option value="Intermediate">Level 2: Intermediate</option>
          <option value="Advanced">Level 3: Advanced</option>
        </select>
        <p>Current selection: {level}</p>

        <button className="quiz-button" onClick={handleDownload}>
        Download Results to View Later
        </button>
      </div>
    </div>
  );
}

