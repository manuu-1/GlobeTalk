# GlobeTalk — Real-time Chat & Video Calling App (MERN + Stream)

**GlobeTalk** is a full-stack, production-ready real-time chat and video calling application built with the MERN stack and Stream (Chat & Video).  
It’s designed for language exchange and social connection: users onboard, make friends, chat instantly, and start one-on-one or group video calls with screen sharing and recording.


# Features
- Signup / Login with JWT (httpOnly cookies) and secure password hashing (bcrypt)  
- Onboarding (bio, languages, location, profile image)  
- Real-time chat using Stream Chat  
- Real-time video calls using Stream Video  
- Friend system: send/accept requests  
- 32 UI themes using Zustand + DaisyUI  
- Production-ready MERN structure  
- Deployed on Render / cloud platforms


# Setup Instructions
## Backend

cd backend

npm install

cp .env.example .env

npm run dev


## Frontend
cd frontend

npm install

cp .env.example .env

npm run dev


# Environment Variables

## backend/.env.example
PORT=5000

MONGO_URI=your_mongo_uri

JWT_SECRET=your_jwt_secret

STREAM_API_KEY=your_stream_api_key

STREAM_API_SECRET=your_stream_api_secret


## frontend/.env.example
VITE_API_URL=http://localhost:5000

VITE_STREAM_API_KEY=your_stream_api_key


