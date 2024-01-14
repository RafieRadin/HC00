const multer = require('multer');
const path = require('path');

const allowedFileTypes = ['text/x-python']; // Updated to allow only Python files
const maxSize = 5 * 1024 * 1024; // 5 MB limit

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './modelUploads');
  },
  filename: function (req, file, cb) {
    const modelName = req.body.modelName || 'default';
    const ext = path.extname(file.originalname);
    cb(null, `${modelName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only Python files are allowed'), false);
  }
};

const limits = {
  fileSize: maxSize,
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const uploadController = (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file provided');
    }

    console.log(req.body); // Check what is in the request body
    console.log(req.file);
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  upload,
  uploadController,
};
