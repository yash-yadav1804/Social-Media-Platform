# Setup Instructions

## Quick Start Guide

### Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" and get your connection string
5. It will look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Step 2: Backend Configuration

1. Navigate to the backend folder:
```bash
cd backend
```

2. Copy the example environment file:
```bash
copy .env.example .env
```

3. Open `.env` file and update with your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/social-post-app?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
NODE_ENV=development
```

**Important**: Replace `your_username`, `your_password`, and `your_random_secret_key_here_make_it_long_and_secure` with actual values.

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Step 5: Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### Step 6: Start Frontend

```bash
npm start
```

The app will open at `http://localhost:3000`

## Testing the Application

1. **Register**: Click "Sign Up" and create an account
2. **Login**: Use your credentials to log in
3. **Create Post**: Write something and click "Post"
4. **Interact**: Like and comment on posts

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct
- Ensure port 5000 is not in use
- Verify all environment variables are set

### Frontend won't connect
- Make sure backend is running on port 5000
- Check browser console for errors
- Clear browser cache and reload

### MongoDB connection error
- Verify your IP address is whitelisted in MongoDB Atlas
- Check username and password in connection string
- Ensure network access is configured

## Common Issues

**Error: "Cannot connect to MongoDB"**
- Solution: Whitelist your IP in MongoDB Atlas Network Access

**Error: "Port 5000 already in use"**
- Solution: Change PORT in .env file or kill the process using port 5000

**Error: "Token is not valid"**
- Solution: Clear localStorage and login again

## Production Deployment

### Backend (Render)
1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Create account on [Vercel](https://vercel.com)
2. Import project
3. Set build command: `npm run build`
4. Set environment variable: `REACT_APP_API_URL=your_backend_url`
5. Deploy

## Need Help?

Check the main README.md for more detailed information.
