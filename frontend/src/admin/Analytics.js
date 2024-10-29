import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [userStats, setUserStats] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [reportType, setReportType] = useState("");

  const getUserStats = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/users/stats", {
      headers: { "x-token": token }
    });
    setUserStats(response.data);
  };

  const getQuizStats = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/quizzes/stats", {
      headers: { "x-token": token }
    });
    setQuizStats(response.data);
  };

  const generateReport = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      "http://localhost:5000/reports",
      { reportType },
      {
        headers: { "x-token": token },
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report_${reportType}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getUserStats();
    getQuizStats();
  }, []);

  // Chart Data Preparation
  const userData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "User Statistics",
        data: [userStats?.activeCount || 0, userStats?.inactiveCount || 0],
        backgroundColor: ["#42a5f5", "#ff7043"],
        borderColor: "#fff",
        borderWidth: 1
      }
    ]
  };

  const quizData = {
    labels: ["Average Score", "Total Quizzes Taken"],
    datasets: [
      {
        label: "Quiz Statistics",
        data: [quizStats?.averageScore || 0, quizStats?.takenCount || 0],
        backgroundColor: ["#66bb6a", "#ffca28"],
        borderColor: "#fff",
        borderWidth: 1
      }
    ]
  };

  return (
    <div>
      <h1>Analytics</h1>

      <h2>User Statistics</h2>
      {userStats && (
        <div>
          <p>Active Users: {userStats.activeCount}</p>
          <p>Inactive Users: {userStats.inactiveCount}</p>
          <Pie data={userData} />
        </div>
      )}

      <h2>Quiz Statistics</h2>
      {quizStats && (
        <div>
          <p>Average Score: {quizStats.averageScore}</p>
          <p>Quiz Count: {quizStats.takenCount}</p>
          <Bar data={quizData} />
        </div>
      )}

      <h2>Generate Reports</h2>
      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
      >
        <option value="">Select Report Type</option>
        <option value="user">User Report</option>
        <option value="quiz">Quiz Report</option>
      </select>
      <button onClick={generateReport}>Generate Report</button>
    </div>
  );
};

export default Analytics;
