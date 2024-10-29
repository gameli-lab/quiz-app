import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./ProgressChart.css";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = () => {
  const [progressData, setProgressData] = useState({
    labels: [],
    datasets: []
  });
  const userId = localStorage.getItem("userId"); // Assuming user ID is stored in local storage

  useEffect(() => {
    // Fetch progress data for the student from the backend
    if (userId) {
      fetchProgressData(userId);
    } else {
      console.error("User ID is not available.");
    }
  }, [userId]);

  const fetchProgressData = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/progress/${userId}`, // Updated URL to match backend route
        {
          headers: {
            "x-token": token
          }
        }
      );

      // Assuming response contains an array of progress data with scores and quiz titles
      const scores = response.data.map((item) => item.score); // Extracting scores
      const labels = response.data.map((item) => item.quizId); // Adjust based on how you want to label quizzes

      setProgressData({
        labels: labels,
        datasets: [
          {
            label: "Scores",
            data: scores,
            fill: false,
            backgroundColor: "blue",
            borderColor: "lightblue",
            pointBackgroundColor: "lightblue",
            pointBorderColor: "blue",
            tension: 0.2 // Adds smooth curves to the line
          }
        ]
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  return (
    <div className="progress-chart-container">
      <h2>Your Progress</h2>
      <div className="progress-chart">
        {progressData.labels.length > 0 ? (
          <Line data={progressData} />
        ) : (
          <p>Loading progress data...</p>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
