import React, { useState, useEffect } from "react";
//import "./teacher-dashboard.css";

const ManageQuizzesSection = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes from backend
    async function fetchQuizzes() {
      const response = await fetch("http://localhost:5000/quizzes", {
        method: "GET",
        headers: {
          "x-token": localStorage.getItem("authToken")
        }
      });
      const data = await response.json();
      setQuizzes(data);
    }

    fetchQuizzes();
  }, []);

  return (
    <div className="manage-quizzes-section">
      <h2>Manage Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <span>{quiz.title}</span>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageQuizzesSection;
