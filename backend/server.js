const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { initializeAdmin } = require('./utils/initializeAdmin');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management System API',
      version: '1.0.0',
      description: 'REST API for User Management System with JWT Authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_management';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('   Database:', mongoose.connection.name);
  console.log('   Host:', mongoose.connection.host);
  console.log('   Port:', mongoose.connection.port);
  
  // Initialize admin user
  initializeAdmin();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('   Connection URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  console.error('⚠️  Server will continue running but database operations will fail');
  console.error('💡 Please ensure MongoDB is running or update MONGODB_URI in .env file');
  // Don't exit - allow server to run for testing other functionality
});

// Log connection state changes
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose disconnected from MongoDB');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;

