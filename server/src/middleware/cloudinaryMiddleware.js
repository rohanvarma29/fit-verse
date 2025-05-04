const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Log Cloudinary configuration for debugging
console.log('Cloudinary Configuration:');
console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'Not set');
console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? 'Set (hidden)' : 'Not set');
console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'Not set');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get max file size from environment variables
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024); // Default: 5MB

// Configure multer to use disk storage temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create upload middleware with file filtering
const multerUpload = multer({
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

// Create directory if it doesn't exist
const tmpDir = 'tmp/uploads/';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Middleware to handle file upload to disk
const handleMulterUpload = (fieldName) => {
  return multerUpload.single(fieldName);
};

// Middleware to handle Cloudinary upload
const handleCloudinaryUpload = async (req, res, next) => {
  if (!req.file) return next();
  
  // Store the original local file path
  const localFilePath = req.file.path;
  
  try {
    console.log('Uploading file to Cloudinary:', localFilePath);
    
    // Ensure Cloudinary is configured before upload
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing:');
      console.error('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'Not set');
      console.error('- API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
      console.error('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');
      return next(new Error('Cloudinary configuration is incomplete. Check environment variables.'));
    }
    
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'profile-photos',
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });
    
    console.log('Cloudinary upload successful:', result.secure_url);
    
    // Add Cloudinary data to the request
    req.file.cloudinary = result;
    req.file.path = result.secure_url;
    
    // Delete temporary file using the stored local path
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log('Deleted temporary file:', localFilePath);
    }
    
    next();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Delete temporary file if upload fails - using the original local path
    if (req.file && localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log('Deleted temporary file after error:', localFilePath);
    }
    next(error);
  }
};

// Combined middleware for convenience
const upload = {
  single: (fieldName) => {
    return [handleMulterUpload(fieldName), handleCloudinaryUpload];
  }
};

// Function to upload directly to Cloudinary (without multer)
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'profile-photos',
      ...options
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

// Extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Extract the public_id from a URL like:
    // https://res.cloudinary.com/decsphx7q/image/upload/v1234567890/profile-photos/abcdef123456
    const urlParts = url.split('/');
    
    // Find the upload part index
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after the version number (which starts with v)
    const versionAndRest = urlParts.slice(uploadIndex + 1);
    const nonVersionParts = versionAndRest.filter(part => !part.match(/^v\d+$/));
    
    return nonVersionParts.join('/');
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  cloudinary
};