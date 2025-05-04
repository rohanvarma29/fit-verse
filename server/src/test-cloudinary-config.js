require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');

console.log('=== Cloudinary Configuration Test ===');
console.log('Environment Variables:');
console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'Not set');
console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set (hidden)' : 'Not set');
console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'Not set');

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  console.log('\nCloudinary Configuration Successful!');
  console.log('Current Configuration:', cloudinary.config().cloud_name);
  
  // Test API connection
  console.log('\nTesting API Connection...');
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error('API Connection Failed:', error.message);
    } else {
      console.log('API Connection Successful:', result);
    }
  });
} catch (error) {
  console.error('\nCloudinary Configuration Failed:', error.message);
}