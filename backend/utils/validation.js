const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only alphabets'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage('Phone must be 10-15 digits'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Address must not exceed 150 characters'),
  
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('pincode')
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage('Pincode must be 4-10 digits'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
];

// Login validation rules
exports.loginValidation = [
  body('emailOrPhone')
    .trim()
    .notEmpty()
    .withMessage('Email or phone is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Update user validation rules
exports.updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only alphabets'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage('Phone must be 10-15 digits'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Address must not exceed 150 characters'),
  
  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),
  
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),
  
  body('pincode')
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage('Pincode must be 4-10 digits')
];

