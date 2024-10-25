import React, { useState, useEffect } from "react";
import "./QuizSection.css";

const QuizSection = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes from backend
    async function fetchQuizzes() {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/quizzes", {
        headers: {
          "x-token": token
        }
      });
      const data = await response.json();
      setQuizzes(data);
    }

    fetchQuizzes();
  }, []);

  return (
    <div className="quiz-section">
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <span>{quiz.title}</span>
            <button>Start Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizSection;
