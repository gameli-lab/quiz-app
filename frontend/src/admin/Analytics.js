/* // src/components/admin/Analytics.js
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import './Analytics.css';

const Analytics = () => {
  const [quizData, setQuizData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Fetch analytics data from backend
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const quizResponse = await axios.get('/admin/analytics/quizzes');
      const userResponse = await axios.get('/admin/analytics/users');
      const logResponse = await axios.get('/admin/analytics/activityLogs');

      setQuizData(quizResponse.data);
      setUserData(userResponse.data);
      setActivityLogs(logResponse.data);

      prepareChartData(quizResponse.data, userResponse.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const prepareChartData = (quizzes, users) => {
    // Prepare data for charts (e.g., number of quizzes taken, average scores)
    const quizTakenData = quizzes.map(quiz => quiz.takenCount);
    const averageScoreData = quizzes.map(quiz => quiz.averageScore);
    const activeUserData = users.map(user => user.activeCount);

    setChartData({
      quizzesTaken: {
        labels: quizzes.map(quiz => quiz.subjectName),
        datasets: [
          {
            label: 'Quizzes Taken',
            data: quizTakenData,
            backgroundColor: 'rgba(75,192,192,0.4)',
          },
        ],
      },
      averageScores: {
        labels: quizzes.map(quiz => quiz.subjectName),
        datasets: [
          {
            label: 'Average Scores',
            data: averageScoreData,
            backgroundColor: 'rgba(153,102,255,0.4)',
          },
        ],
      },
      activeUsers: {
        labels: users.map(user => user.role),
        datasets: [
          {
            label: 'Active Users',
            data: activeUserData,
            backgroundColor: 'rgba(255,159,64,0.4)',
          },
        ],
      },
    });
  };

  return (
    <div className="analytics-container">
      <h2>Platform Analytics</h2>

      <div className="chart-section">
        <h3>Quizzes Taken Over Time</h3>
        <Line data={chartData.quizzesTaken} />

        <h3>Average Quiz Scores</h3>
        <Bar data={chartData.averageScores} />

        <h3>Active Users</h3>
        <Pie data={chartData.activeUsers} />
      </div>

      <div className="activity-logs-section">
        <h3>Activity Logs</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.username}</td>
                <td>{log.action}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reports-section">
        <h3>Download Reports</h3>
        <button onClick={() => generateReport('csv')}>Download CSV</button>
        <button onClick={() => generateReport('pdf')}>Download PDF</button>
      </div>
    </div>
  );
};

const generateReport = (format) => {
  // Generate reports in CSV or PDF format by calling backend endpoint
  window.location.href = `/admin/analytics/reports?format=${format}`;
};

export default Analytics;
 */

// src/components/admin/Analytics.js
import React, { useState, useEffect } from "react";
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
import axios from "axios";
import "./Analytics.css";

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
  const [quizData, setQuizData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Fetch analytics data from backend
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const quizResponse = await axios.get("/admin/analytics/quizzes");
      const userResponse = await axios.get("/admin/analytics/users");
      const logResponse = await axios.get("/admin/analytics/activityLogs");

      // Check if response is JSON before setting state
      if (quizResponse.headers["content-type"].includes("application/json")) {
        setQuizData(quizResponse.data);
      } else {
        console.error("Unexpected response format for quizzes");
      }

      if (userResponse.headers["content-type"].includes("application/json")) {
        setUserData(userResponse.data);
      } else {
        console.error("Unexpected response format for users");
      }

      if (logResponse.headers["content-type"].includes("application/json")) {
        setActivityLogs(logResponse.data);
      } else {
        console.error("Unexpected response format for activity logs");
      }

      // Prepare the chart data for rendering
      prepareChartData(quizResponse.data, userResponse.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const prepareChartData = (quizzes, users) => {
    const quizTakenData = quizzes.map((quiz) => quiz.takenCount);
    const averageScoreData = quizzes.map((quiz) => quiz.averageScore);
    const activeUserData = users.map((user) => user.activeCount);

    setChartData({
      quizzesTaken: {
        labels: quizzes.map((quiz) => quiz.subjectName),
        datasets: [
          {
            label: "Quizzes Taken",
            data: quizTakenData,
            backgroundColor: "rgba(75,192,192,0.4)"
          }
        ]
      },
      averageScores: {
        labels: quizzes.map((quiz) => quiz.subjectName),
        datasets: [
          {
            label: "Average Scores",
            data: averageScoreData,
            backgroundColor: "rgba(153,102,255,0.4)"
          }
        ]
      },
      activeUsers: {
        labels: users.map((user) => user.role),
        datasets: [
          {
            label: "Active Users",
            data: activeUserData,
            backgroundColor: "rgba(255,159,64,0.4)"
          }
        ]
      }
    });
  };

  return (
    <div className="analytics-container">
      <h2>Platform Analytics</h2>

      <div className="chart-section">
        <h3>Quizzes Taken Over Time</h3>
        {/* Ensure data is available before rendering the chart */}
        {chartData.quizzesTaken && <Line data={chartData.quizzesTaken} />}

        <h3>Average Quiz Scores</h3>
        {/* Ensure data is available before rendering the chart */}
        {chartData.averageScores && <Bar data={chartData.averageScores} />}

        <h3>Active Users</h3>
        {/* Ensure data is available before rendering the chart */}
        {chartData.activeUsers && <Pie data={chartData.activeUsers} />}
      </div>

      <div className="activity-logs-section">
        <h3>Activity Logs</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.username}</td>
                <td>{log.action}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reports-section">
        <h3>Download Reports</h3>
        <button onClick={() => generateReport("csv")}>Download CSV</button>
        <button onClick={() => generateReport("pdf")}>Download PDF</button>
      </div>
    </div>
  );
};

const generateReport = (format) => {
  // Generate reports in CSV or PDF format by calling backend endpoint
  window.location.href = `/admin/analytics/reports?format=${format}`;
};

export default Analytics;
