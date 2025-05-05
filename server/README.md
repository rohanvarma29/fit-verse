# FitVerse Server

This is a MERN stack authentication system for the FitVerse platform.

## Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Input validation
- Rate limiting
- MongoDB integration
- Error handling middleware
- Program management with FAQs

## API Endpoints

### Authentication Routes

- **Register User**: `POST /api/users/register`

  - Required fields: firstName, lastName, email, password, displayName, location
  - Returns JWT token upon successful registration

- **Login User**: `POST /api/users/login`
  - Required fields: email, password
  - Returns user data and JWT token

### Program Routes

- **Create Program**: `POST /api/programs`
  - Required fields: programName, programDescription, programDuration, programPrice
  - Optional: programHighlights, FAQs
  - Associates the program with the logged-in user

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": {}, // user data/token
  "message": "Success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Setup Instructions

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file using the `.env.example` template
4. Start the development server
   ```
   npm run dev
   ```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time (default: 30d)
- `CORS_ORIGIN`: Frontend URL for CORS configuration (default: http://localhost:8080)
- `NODE_ENV`: Environment mode (development/production)
- `UPLOAD_PATH`: Path for storing uploaded files (default: public/images/profile-photo/)
- `MAX_FILE_SIZE`: Maximum file size for uploads in bytes (default: 5242880 - 5MB)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds (default: 900000 - 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for image uploads
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret key
