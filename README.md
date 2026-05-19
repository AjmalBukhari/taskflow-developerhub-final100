# Task Manager

A full-stack task management app built with React, Node.js, Express, and MongoDB.

## Features

- User registration & login (JWT)
- Create, edit, delete, restore, and permanently delete tasks
- Task status: Pending / In Progress / Completed
- Priority levels: Low / Medium / High
- Task sharing with other users
- Soft delete with bin system
- Search and filter tasks
- Bulk select and delete
- Real-time notifications via Socket.IO
- Dark mode
- Responsive design with Tailwind CSS
- Profile and account settings
- Forgot/reset password

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion, Axios, Socket.IO Client
**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcrypt, Socket.IO
**Tools:** ESLint, Prettier

## Setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

Run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000`.

## Project Structure

```
task-manager/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── routes/          # API routes
│   ├── models/          # Mongoose models
│   ├── middleware/       # Auth and validation
│   ├── services/        # Socket.io setup
│   ├── utils/           # Error handler, helpers
│   ├── config/          # App config
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── layout/  # Header, Sidebar, MainLayout
│   │   │   ├── pages/   # Dashboard, Tasks, Profile, etc.
│   │   │   └── ui/      # Toast, modals
│   │   ├── context/     # React contexts
│   │   ├── services/    # API calls, socket service
│   │   ├── App.jsx      # Main app
│   │   └── index.js     # Entry point
│   ├── public/
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get profile |
| PUT | /api/auth/me | Update profile |
| DELETE | /api/auth/me | Delete account |
| POST | /api/auth/forgot-password | Change password |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Soft delete |
| GET | /api/tasks/bin | Get deleted tasks |
| PUT | /api/tasks/restore/:id | Restore task |
| DELETE | /api/tasks/permanent/:id | Permanent delete |
| PUT | /api/tasks/:id/share | Share task |
| GET | /api/tasks/shared | Get shared tasks |
| GET | /api/notifications | Get notifications |
| PUT | /api/notifications/:id/read | Mark read |
| PUT | /api/notifications/read-all | Mark all read |
| DELETE | /api/notifications/:id | Delete notification |
| GET | /api/notifications/unread-count | Unread count |
