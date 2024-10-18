import React from 'react';
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
