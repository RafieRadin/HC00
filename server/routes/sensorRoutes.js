const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { requireAuth } = require('../middleware/requireAuth');

// router.use(requireAuth);

router.post('/upload', sensorController.uploadSensorData);
router.get('/', sensorController.getAllSensorData);

module.exports = router;
