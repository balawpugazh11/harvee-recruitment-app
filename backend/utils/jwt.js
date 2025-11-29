const jwt = require('jsonwebtoken');

// Get JWT secrets with fallback
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your_jwt_secret_key_here_change_in_production_12345') {
    console.warn('⚠️  JWT_SECRET not set or using default. Please set a secure secret in .env file');
    return secret || 'default_jwt_secret_change_in_production';
  }
  return secret;
};

const getJWTRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret || secret === 'your_jwt_refresh_secret_key_here_change_in_production_67890') {
    console.warn('⚠️  JWT_REFRESH_SECRET not set or using default. Please set a secure secret in .env file');
    return secret || 'default_jwt_refresh_secret_change_in_production';
  }
  return secret;
};

// Generate access token (1 hour)
exports.generateAccessToken = (userId) => {
  const secret = getJWTSecret();
  if (!secret) {
    throw new Error('JWT_SECRET is required. Please set it in .env file');
  }
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '1h' }
  );
};

// Generate refresh token (7 days)
exports.generateRefreshToken = (userId) => {
  const secret = getJWTRefreshSecret();
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is required. Please set it in .env file');
  }
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '7d' }
  );
};

// Verify access token
exports.verifyAccessToken = (token) => {
  const secret = getJWTSecret();
  if (!secret) {
    throw new Error('JWT_SECRET is required. Please set it in .env file');
  }
  return jwt.verify(token, secret);
};

// Verify refresh token
exports.verifyRefreshToken = (token) => {
  const secret = getJWTRefreshSecret();
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is required. Please set it in .env file');
  }
  return jwt.verify(token, secret);
};

