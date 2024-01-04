const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var waterQualitySchema = new mongoose.Schema({
    sensorID:{
        type:mongoose.ObjectId,
        ref:'Sensor',
        required:true,
    },
    temperature:{
        type: Number,
        required:true,
    },
    pH:{
        type:Number,
        required:true,
    },
    dissolvedOxygen:{
        type:Number,
        required:true,
    },
},{timestamps: true}
);

//Export the model
module.exports = mongoose.model('WaterQuality', waterQualitySchema);