const multer = require('multer');
const path = require('path');

// Get upload configuration from environment variables
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'public/images/profile-photo/';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024); // Default: 5MB

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        // Create unique filename using timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create upload middleware with file filtering
const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = upload;