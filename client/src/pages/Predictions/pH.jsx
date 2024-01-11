// Ph.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../../components/Chart/LineChartPredict';

function Ph() {
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

  const phDataset = {
    fill: true,
    label: 'pH',
    data: sensorData.map(data => data.ph),
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.5)',
  };

  return (
    <div className="container mx-auto pl-16 pr-16">
        <LineChart dataset={phDataset} labels={sensorData.map(data => data.timestamp)} chartTitle="pH Chart" />
    </div>
  );
}

export default Ph;
