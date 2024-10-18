import React, { useState, useEffect } from 'react';
import './teacher-dashboard.css';

const ViewResultsSection = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch results from backend
    async function fetchResults() {
      const response = await fetch('http://localhost:5000/results');
      const data = await response.json();
      setResults(data);
    }

    fetchResults();
  }, []);

  return (
    <div className="view-results-section">
      <h2>Student Results</h2>
      <table>
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Student</th>
            <th>Score</th>
            <th>Date Taken</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td>{result.quizTitle}</td>
              <td>{result.studentName}</td>
              <td>{result.score}</td>
              <td>{new Date(result.completedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResultsSection;
