require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/api', userRoutes);


app.get('/health', async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'User Management Service',
      database: 'Connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'Error', 
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;