require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test function to upload an image to Cloudinary
async function testCloudinaryUpload() {
  try {
    console.log('Cloudinary Configuration:');
    console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('- API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Not Set');
    
    // Use a sample image URL for testing
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg';
    console.log('\nUploading sample image from URL:', sampleImageUrl);
    
    // Upload the image
    const result = await cloudinary.uploader.upload(sampleImageUrl, {
      folder: 'test',
      public_id: 'test-shoes-' + Date.now()
    });
    
    console.log('\nUpload successful!');
    console.log('- Secure URL:', result.secure_url);
    console.log('- Public ID:', result.public_id);
    console.log('- Format:', result.format);
    console.log('- Size:', result.bytes, 'bytes');
    console.log('- Dimensions:', result.width, 'x', result.height);
    
    // Test transformations
    console.log('\nGenerating transformed URL:');
    const transformedUrl = cloudinary.url(result.public_id, {
      width: 300,
      height: 300,
      crop: 'fill',
      fetch_format: 'auto',
      quality: 'auto'
    });
    
    console.log('- Transformed URL:', transformedUrl);
    
    return result;
  } catch (error) {
    console.error('Error testing Cloudinary upload:', error);
    throw error;
  }
}

// Run the test
testCloudinaryUpload()
  .then(() => {
    console.log('\nTest completed successfully!');
  })
  .catch((error) => {
    console.error('\nTest failed:', error.message);
    process.exit(1);
  });