import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./QuizSection.css";

const QuizSection = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate(); // Initialize navigate for redirecting

  useEffect(() => {
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

  // Function to handle start quiz
  const handleStartQuiz = (subjectId) => {
    navigate(`../${subjectId}`); // Redirect to a specific quiz page
  };

  return (
    <div className="quiz-section">
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <span>{quiz.title}</span>
            <button onClick={() => handleStartQuiz(quiz.id)}>Start Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizSection;
