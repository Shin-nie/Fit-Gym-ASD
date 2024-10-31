const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database'); // Your Sequelize instance
// Import routes
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const setRoutes = require('./routes/setRoutes');
const exerciseRoutes = require('./routes/exercisesRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Authenticate and Sync the Database
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
    // Sync the database (this will create the tables if they don't exist)
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Serve static files from the frontend's dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Register API routes, prefixed with /api
app.use('/api', userRoutes);
app.use('/api', customerRoutes);
app.use('/api', workoutRoutes);
app.use('/api', exerciseRoutes);
app.use('/api', setRoutes);
app.use('/api', trainerRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', transactionRoutes);
app.use('/api', bookingRoutes);
app.use('/api', certificateRoutes);
app.use('/api', measurementRoutes);
app.use('/api', attendanceRoutes);

// Simple route to test the server
app.get('/api/health', (req, res) => {
  res.send('API is working');
});

// Catch-all route to serve index.html for any non-API routes (client-side routing support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
