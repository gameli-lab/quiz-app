/* import React from 'react';
import { Line } from 'react-chartjs-2';
import './ProgressChart.css';

const ProgressChart = () => {
  // Example data, could be fetched from the backend
  const data = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
    datasets: [
      {
        label: 'Scores',
        data: [85, 90, 78, 88, 92],
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'lightblue',
      },
    ],
  };

  return (
    <div className="progress-chart">
      <Line data={data} />
    </div>
  );
};

export default ProgressChart;
 */

// src/components/student/ProgressChart.js
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

  useEffect(() => {
    // Fetch progress data for the student from the backend
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get("/student/progress");

      const scores = response.data.scores; // Assuming the response contains an array of quiz scores
      const labels = response.data.labels; // Assuming the response contains an array of quiz names

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
