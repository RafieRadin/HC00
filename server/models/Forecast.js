const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var forecastSchema = new mongoose.Schema({
    dataID:{
        type:mongoose.ObjectId,
        ref : "WaterQuality",
        required:true,
    },
    temperature: [{
        type: Number,
        required:true,
    }],
    pH:[{
        type:Number,
        required:true,
    }],
    dissolvedOxygen:[{
        type:Number,
        required:true,
    }],
});

//Export the model
module.exports = mongoose.model('Forecast', forecastSchema);