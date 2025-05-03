
# Welcome to FitVerse - Fitness & Wellness Platform

## About

FitVerse is a platform that connects users with certified fitness trainers, nutritionists, and yoga instructors. Whether you're looking to get in shape, improve your nutrition, or find inner peace through yoga, FitVerse provides the perfect match for your wellness journey.

Our platform offers:
- Access to certified fitness and wellness professionals
- Personalized training and nutrition plans
- Flexible scheduling options for sessions
- Both virtual and in-person training opportunities

## Project info

**URL**: https://lovable.dev/projects/43f01f5d-2b08-484a-8e29-6acafcb5cc96

## How can I run this code?

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/rohanvarma29/skill-sphere-web.git

# Step 2: Navigate to the project directory.
cd skill-sphere-web

# Step 3: Create .env files for both client and server
# Use the .env.example files as templates
cp .env.example .env
cp server/.env.example server/.env

# Step 4: Install the necessary dependencies for client and server
npm i
cd server && npm i && cd ..

# Step 5: Start the development server with auto-reloading and an instant preview.
# In one terminal:
npm run dev
# In another terminal:
cd server && npm run dev
```

Once the development servers start, you can open your browser and navigate to `http://localhost:8080` to see the application running.

## Environment Variables

### Client Environment Variables
- `VITE_API_URL`: API base URL (default: http://localhost:3000/api)
- `VITE_SERVER_URL`: Server URL for assets like images (default: http://localhost:3000)

For server environment variables, please see the [server README](/server/README.md).

## What technologies are used for this project?

This project is built with:

- Vite - Fast build tool and development server
- TypeScript - Type-safe JavaScript
- React - UI framework
- shadcn-ui - UI component library
- Tailwind CSS - Utility-first CSS framework
- Express - Backend framework
- MongoDB - Database

AI Tools:

- Lovable AI - Development assistance and code generation
- Lovable Tagger - Component tagging and organization
- Amazon Q Developer

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/43f01f5d-2b08-484a-8e29-6acafcb5cc96) and click on Share -> Publish.
