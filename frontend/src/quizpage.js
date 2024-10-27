import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./quizpage.css";

const QuizPage = () => {
  const { quizId } = useParams(); // Get quizId from URL params
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(600); // 10-minute countdown
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  useEffect(() => {
    // Fetch quiz data from backend
    const fetchQuizData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `http://localhost:5000/quizzes/${quizId}`,
          {
            headers: { "x-token": token }
          }
        );
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (isQuizStarted && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleQuizEnd();
    }
  }, [isQuizStarted, timer]);

  const startQuiz = () => setIsQuizStarted(true);
  const stopQuiz = () => setIsQuizStarted(false);

  const handleQuizEnd = () => {
    stopQuiz();
    alert("Time is up! Quiz ended.");
    navigate("/dashboard");
  };

  const handleCancelQuiz = () => {
    if (window.confirm("Are you sure you want to cancel the quiz?")) {
      navigate("/dashboard");
    }
  };

  const handleAnswerSelection = (answer) => setSelectedAnswer(answer);

  const submitAnswer = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer.");
      return;
    }
    // Logic to submit answer here...
    setSelectedAnswer(null); // Clear selection
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("You've completed the quiz!");
      handleQuizEnd();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!quizData) return <p>Loading quiz...</p>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="cancel-button" onClick={handleCancelQuiz}>
          X
        </button>
        <div className="timer">
          Time Left: {Math.floor(timer / 60)}:{timer % 60}
        </div>
        {isQuizStarted ? (
          <button onClick={stopQuiz}>Stop</button>
        ) : (
          <button onClick={startQuiz}>Start</button>
        )}
      </div>

      {isQuizStarted && (
        <div className="question-section">
          <h3>{`Question ${currentQuestionIndex + 1}`}</h3>
          <p>{currentQuestion.questionText}</p>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelection(option)}
                />
                {option}
              </label>
            ))}
          </div>

          <div className="navigation">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button onClick={submitAnswer}>Submit Answer</button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === quizData.questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
