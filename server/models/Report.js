const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var reportSchemma = new mongoose.Schema({
    dataID:{
        type:mongoose.ObjectId,
        ref: 'WaterQuality',
        required:true,
    },
    forecastID:{
        type:mongoose.ObjectId,
        ref: 'Forecast',
        required:true,
    },
    reportName:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Report', reportSchemma);