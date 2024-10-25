import React, { useState, useEffect } from "react";
import "./ResultsSection.css";

const ResultsSection = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch results from backend
    async function fetchResults() {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/results", {
        headers: {
          "x-token": token
        }
      });
      const data = await response.json();
      setResults(data);
    }

    fetchResults();
  }, []);

  return (
    <div className="results-section">
      <table>
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Score</th>
            <th>Date Taken</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.quizTitle}</td>
              <td>{result.score}</td>
              <td>{new Date(result.completedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsSection;
