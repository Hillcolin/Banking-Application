import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import accountRouter from './routes/account';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://127.0.0.1:5173' })); // Enable CORS for the frontend origin
app.use(express.json());

// Routes
app.use('/auth', authRouter); // Mount the auth routes
app.use('/account', accountRouter); // Mount account routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});