const connectDB = require("./db");
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const accessRoutes = require('./routes/access');
const chatRoutes = require('./routes/chat');

dotenv.config();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();


// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        process.env.FRONTEND_URL, // Custom env var
        process.env.RENDER_EXTERNAL_URL // Auto-set by Render
    ].filter(Boolean), // Remove undefined values
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/chat', chatRoutes);

const path = require('path');

// Serve static files from the frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Health Check API (moved to /api/health to avoid conflict with frontend)
app.get('/api/health', (req, res) => {
    res.send('Web3 Data Privacy Backend is running');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
