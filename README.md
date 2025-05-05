# FitVerse - Fitness & Wellness Platform

## About

FitVerse is a comprehensive fitness and wellness platform that connects users with certified fitness trainers, nutritionists, and yoga instructors. Built with modern web technologies, FitVerse provides a seamless experience for both fitness professionals and clients.

### Key Features

- **Expert Profiles**: Certified fitness professionals can create and manage detailed profiles
- **Program Management**: Trainers can create and manage multiple fitness programs
- **Scheduling System**: Integrated Calendly scheduling for session booking
- **Real-time Search**: Dynamic search functionality for finding experts by name, location, or specialty
- **Secure Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first approach ensuring accessibility across all devices

## Architecture

![Diagram](/public/architecture.jpeg)

## Technical Stack

### Frontend

- React with TypeScript
- Vite for build tooling
- shadcn-ui components
- Tailwind CSS for styling
- React Query for state management

### Backend

- Express.js server
- MongoDB database
- JWT authentication
- Cloudinary for media storage

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Cloudinary account

### Setup Steps

```sh
# Clone the repository
git clone https://github.com/rohanvarma29/skill-sphere-web.git

# Navigate to project directory
cd skill-sphere-web

# Create environment files
cp .env.example .env
cp server/.env.example server/.env

# Install dependencies
npm install
cd server && npm install && cd ..

# Start development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

## Environment Configuration

### Client (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_SERVER_URL=http://localhost:3000
```

### Server (.env)

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Profile Endpoints

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/update` - Update user profile
- `PATCH /api/users/availability` - Update availability

### Program Endpoints

- `POST /api/programs` - Create program
- `GET /api/programs/expert/:id` - Get expert's programs
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program

## Deployment

The project is configured for deployment on Vercel:

1. Frontend: Deploy through Vercel's GitHub integration
2. Backend: Uses custom Vercel configuration (vercel.json)
3. Database: Requires MongoDB Atlas cluster
4. Media Storage: Configured with Cloudinary

## Development Tools

- **Lovable AI** – Used for generating the initial UI and prototyping key components.
- **Lovable Tagger** – Assisted in organizing and labeling UI components during early design.
- **Amazon Q Developer** – Utilized for code generation and backend logic scaffolding.
- **Roo Code** (with **Gemini** and **Claude 3.7 Sonnet**) – Primarily used for backend development, feature implementation, and integration support.
- **ChatGPT** – Leveraged for planning, feature brainstorming, and refining architectural decisions.
- **ESLint** – Ensured code quality and adherence to best practices.
- **Prettier** – Maintained consistent code formatting across the project.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Status

Active development - Regular updates and new features being added.

For more information, visit [Lovable](https://lovable.dev/projects/43f01f5d-2b08-484a-8e29-6acafcb5cc96).
