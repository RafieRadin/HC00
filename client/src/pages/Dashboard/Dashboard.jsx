import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../../components/Chart/LineChart';
import DoughnutChart from '../../components/Chart/Doughnut';

function Dashboard() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Fetch sensor data from the backend initially
    fetchData();

    // Set up an interval to periodically fetch sensor data
    const intervalId = setInterval(fetchData, 300000); // 300,000 milliseconds = 5 minutes

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only on mount and unmount

  const fetchData = () => {
    axios.get('http://localhost:1337/api/sensor')
      .then(response => setSensorData(response.data))
      .catch(error => console.error('Error fetching sensor data:', error));
  };

  const isSensorOnline = () => {
    if (sensorData.length === 0 || !sensorData[0].timestamp) {
      return false;
    }

    const currentTimestamp = new Date();
    const lastUpdate = new Date(sensorData[0].timestamp);
    const setTime = new Date(currentTimestamp - 6 * 60 * 1000);

    return lastUpdate > setTime;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-2">
        <div className="card bg-base-200 shadow-xl">
          <div className="stat">
            <div className="stat-figure invisible md:visible">
              <CheckCircleIcon className='w-8 h-8'/>
            </div>
            <div className="stat-title">Sensor Status</div>
            <div className="stat-value">
              {isSensorOnline() ? "Online" : "Offline"}
            </div>
            <div className="stat-desc">
              {sensorData.length > 0
                ? `Last update: ${formatTimestamp(sensorData[0].timestamp)}`
                : "No data available"}
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="stat">
            <div className="stat-figure invisible md:visible">
              <div className="">°C</div>
            </div>
            <div className="stat-title">Temperature</div>
            <div className="stat-value">{sensorData.length > 0 ? sensorData[0].temperature.toFixed(2) : "N/A"}</div>
            <div className="stat-desc">Min | Max</div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="stat">
            <div className="stat-figure invisible md:visible">
              <div className="">pH</div>
            </div>
            <div className="stat-title">pH</div>
            <div className="stat-value">{sensorData.length > 0 ? sensorData[0].ph.toFixed(2) : "N/A"}</div>
            <div className="stat-desc">Min | Max</div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="stat">
            <div className="stat-figure invisible md:visible">
              <div className="">mg/L</div>
            </div>
            <div className="stat-title">Dissolved Oxygen</div>
            <div className="stat-value">{sensorData.length > 0 ? sensorData[0].dissolvedOxygen.toFixed(2) : "N/A"}</div>
            <div className="stat-desc">Min | Max</div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart
          temperatureData={sensorData.map((data) => data.temperature)}
          pHData={sensorData.map((data) => data.ph)}
          dissolvedOxygenData={sensorData.map((data) => data.dissolvedOxygen)}
          labels={sensorData.map((data) => formatTimestamp(data.timestamp))}
        />
        <DoughnutChart />
      </div>
    </div>
  );
}

export default Dashboard;
