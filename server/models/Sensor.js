const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const sensorSchema = new mongoose.Schema({
    temperature: {
        type: Number,
    },
    ph: {
        type: Number,
    },
    dissolvedOxygen: {
        type: Number,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
module.exports = mongoose.model('SensorData', sensorSchema);
