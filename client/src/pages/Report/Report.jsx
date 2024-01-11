import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Report = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Fetch sensor data from the backend
    axios.get('http://localhost:1337/api/sensor')
      .then(response => setSensorData(response.data))
      .catch(error => console.error('Error fetching sensor data:', error));
  }, []);

  const downloadCsv = () => {
    // Convert sensorData to CSV format
    const csvContent =
      "Sensor ID,Timestamps,Temperature,PH,Dissolved Oxygen\n" +
      sensorData.map(data => [data._id, data.timestamp, data.temperature, data.ph, data.dissolvedOxygen].join(',')).join('\n');

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'sensor_data.csv');
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold leading-7">Sensor Log</h2>
        <div className="btn btn-accent btn-sm" onClick={downloadCsv}>
          Download .CSV
        </div>
      </div>
      <div className="divider mt-2"></div>
      {/* Card Body */}
      <div className='h-full w-full pb-6 bg-base-100'>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Sensor ID</th>
                <th>Timestamps</th>
                <th>Temperature</th>
                <th>PH</th>
                <th>Dissolved Oxygen</th>
              </tr>
            </thead>
            <tbody>
              {sensorData.map(data => (
                <tr key={data._id}>
                  <td>{data._id}</td>
                  <td>{data.timestamp}</td>
                  <td>{data.temperature}</td>
                  <td>{data.ph}</td>
                  <td>{data.dissolvedOxygen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
