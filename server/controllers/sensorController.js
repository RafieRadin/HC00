const Sensor = require('../models/Sensor');

const uploadSensorData = async (req, res) => {
  try {
    // Assuming your request body contains the sensor data
    const { type, temperature, ph, dissolvedOxygen } = req.body;

    // Create a new sensor data instance
    const newSensorData = new Sensor({
      temperature,
      ph,
      dissolvedOxygen,
    });

    // Save the data to the database
    await newSensorData.save();
    console.log('Received sensor data:', req.body);
    res.status(201).json({ message: 'Sensor data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading sensor data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllSensorData = async (req, res) => {
  try {
    // Fetch all sensor data from the database and sort by timestamp in descending order
    const sensorData = await Sensor.find().sort({ timestamp: 1 });

    res.json(sensorData);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  uploadSensorData,
  getAllSensorData,
};
