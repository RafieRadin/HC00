import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../../components/Chart/LineChartPredict';

function DissolvedOxygen() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:1337/api/sensor')
      .then(response => setSensorData(response.data))
      .catch(error => console.error('Error fetching sensor data:', error));
  };

  const dissolvedOxygenDataset = {
    fill: true,
    label: 'Dissolved Oxygen',
    data: sensorData.map(data => data.dissolvedOxygen),
    borderColor: 'rgb(153, 102, 255)',
    backgroundColor: 'rgba(153, 102, 255, 0.5)',
  };

  return (
    <div className="container mx-auto pl-16 pr-16">
        <LineChart dataset={dissolvedOxygenDataset} labels={sensorData.map(data => data.timestamp)} chartTitle="Dissolved Oxygen Chart" />
    </div>
  );
}

export default DissolvedOxygen;
