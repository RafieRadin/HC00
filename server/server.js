const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const sensorRoutes = require('./routes/sensorRoutes'); // Assuming you have a sensorRoutes file
const userRoutes = require('./routes/userRoutes.js');
const modelRoutes = require('./routes/uploadRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next)=>{ 
  if(req.headers['content-length']){
      console.log(req.path, req.method, 'req_size: ' + req.headers['content-length'] + 'bytes')  
  }else{
      console.log(req.path, req.method)
  }
    next()
})

// Connect to MongoDB using the MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// routes
app.use('/api/user', userRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/model', modelRoutes);
app.use('/api', uploadRoutes);

// Start the server
const port = parseInt(process.env.PORT, 10) || 3000;
app.listen(port, () => {
  console.log(`Server is running: Port ${port}`);
});