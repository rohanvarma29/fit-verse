# FitVerse Authentication System

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
  - Required fields: programDescription, programDuration, programPrice
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

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time (default: 30d)
- `CLIENT_URL`: Frontend URL for CORS configuration (default: http://localhost:3000)
