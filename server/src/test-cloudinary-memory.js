require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const https = require('https');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to download an image as a buffer
const downloadImageAsBuffer = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
};

// Test function to upload an image to Cloudinary using memory buffer
async function testCloudinaryMemoryUpload() {
  try {
    console.log('Cloudinary Configuration:');
    console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? 'Set (hidden)' : 'Not set');
    console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'Not set');
    
    // Use a sample image URL for testing
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg';
    console.log('\nDownloading sample image from URL:', sampleImageUrl);
    
    // Download the image as a buffer
    const imageBuffer = await downloadImageAsBuffer(sampleImageUrl);
    console.log('Image downloaded successfully, size:', imageBuffer.length, 'bytes');
    
    console.log('\nUploading image buffer to Cloudinary...');
    
    // Create a promise to handle the stream upload
    const uploadPromise = new Promise((resolve, reject) => {
      // Create upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'test',
          public_id: 'test-memory-' + Date.now()
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      // Pipe the buffer to the upload stream
      streamifier.createReadStream(imageBuffer).pipe(uploadStream);
    });
    
    // Wait for the upload to complete
    const result = await uploadPromise;
    
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
testCloudinaryMemoryUpload()
  .then(() => {
    console.log('\nTest completed successfully!');
  })
  .catch((error) => {
    console.error('\nTest failed:', error.message);
    process.exit(1);
  });