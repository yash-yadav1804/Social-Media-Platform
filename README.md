# Mini Social Post Application

A full-stack social media application built with React, Node.js, Express, and MongoDB. Users can create accounts, share posts with text and images, like posts, and comment on them.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Create Posts**: Share text and image posts
- **Social Interactions**: Like and comment on posts
- **Real-time Feed**: View all posts in chronological order
- **Responsive Design**: Beautiful UI with Bootstrap
- **Secure**: Password hashing and protected routes

## Tech Stack

### Frontend
- React.js
- React Router
- Bootstrap & React-Bootstrap
- Axios
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
social-post-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── utils/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── posts/
    │   │   └── common/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI and JWT secret:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create a new post (protected)
- `PUT /api/posts/:id` - Update a post (protected)
- `DELETE /api/posts/:id` - Delete a post (protected)
- `POST /api/posts/:id/like` - Like/unlike a post (protected)
- `POST /api/posts/:id/comment` - Add a comment (protected)
- `DELETE /api/posts/:id/comment/:commentId` - Delete a comment (protected)

## Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (default placeholder),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  userId: ObjectId (ref: User),
  content: String (required),
  image: String (optional),
  likes: [ObjectId] (array of user IDs),
  comments: [{
    userId: ObjectId,
    username: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Create Post**: Share your thoughts with text and optional image URL
4. **Interact**: Like and comment on posts from other users
5. **View Feed**: See all posts in chronological order

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend
- `REACT_APP_API_URL` - Backend API URL (optional, defaults to http://localhost:5000/api)

## Deployment

### Backend (Render/Heroku)
1. Create a new web service
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variable for API URL

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation
- Error handling middleware
- CORS configuration

## Future Enhancements

- Image upload functionality
- User profiles
- Follow/unfollow users
- Post editing
- Search functionality
- Notifications
- Direct messaging

## License

MIT License

## Author

Created with Windsurf and Sonnet 4 AI

## Support

For issues and questions, please create an issue in the repository.
