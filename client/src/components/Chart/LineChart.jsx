/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function LineChart({ temperatureData, pHData, dissolvedOxygenData, labels }) {
  const [selectedReading, setSelectedReading] = useState('temperature'); // Default to temperature

  // Filter only the latest 24 data entries
  const filteredTemperatureData = temperatureData.slice(-24);
  const filteredpHData = pHData.slice(-24);
  const filteredDissolvedOxygenData = dissolvedOxygenData.slice(-24);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  const getDataset = (label, data, borderColor, backgroundColor) => ({
    fill: true,
    label,
    data,
    borderColor,
    backgroundColor,
  });

  const datasets = [];

  // Add the selected reading to the datasets
  if (selectedReading === 'temperature') {
    datasets.push(getDataset('Temperature', filteredTemperatureData, 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.5)'));
  } else if (selectedReading === 'pH') {
    datasets.push(getDataset('pH', filteredpHData, 'rgb(75, 192, 192)', 'rgba(75, 192, 192, 0.5)'));
  } else if (selectedReading === 'dissolvedOxygen') {
    datasets.push(getDataset('Dissolved Oxygen', filteredDissolvedOxygenData, 'rgb(153, 102, 255)', 'rgba(153, 102, 255, 0.5)'));
  }

  const data = {
    labels: labels.slice(-24), // Use the last 24 labels
    datasets,
  };

  return (
    <div className="card bg-base-200 shadow-xl pb-6">
      <div className="card-body">
        <h2 className="card-title">Charts</h2>
        <p>The graph show the last 24 reading from the sensor. Select sensor readings below:</p>
        <ul className="menu menu-horizontal bg-base-200">
          <li>
            <a
              onClick={() => setSelectedReading('temperature')}
              className={selectedReading === 'temperature' ? 'active' : ''}
            >
              Temperature
            </a>
          </li>
          <li>
            <a onClick={() => setSelectedReading('pH')} className={selectedReading === 'pH' ? 'active' : ''}>
              pH
            </a>
          </li>
          <li>
            <a
              onClick={() => setSelectedReading('dissolvedOxygen')}
              className={selectedReading === 'dissolvedOxygen' ? 'active' : ''}
            >
              Dissolved Oxygen
            </a>
          </li>
        </ul>
      </div>
      <div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default LineChart;
