const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');
const { upload, uploadController } = require('../controllers/modelController');

// router.use(requireAuth);

router.post('/upload', upload.single('file'), uploadController);

router.get('/', (req, res) => {
  // Your GET route logic here
});

module.exports = router;
