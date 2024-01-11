import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../../components/Chart/LineChartPredict';

function Temp() {
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

  const temperatureDataset = {
    fill: true,
    label: 'Temperature',
    data: sensorData.map(data => data.temperature),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  };

  return (
    <div className="container mx-auto pl-16 pr-16">
      <LineChart dataset={temperatureDataset} labels={sensorData.map(data => data.timestamp)} chartTitle="Temperature Chart" />
    </div>
  );
}

export default Temp;
