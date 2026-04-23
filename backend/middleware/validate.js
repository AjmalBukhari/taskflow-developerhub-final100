const { body, validationResult } = require('express-validator');

// Validation rules for task
const validateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),

  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Invalid status value'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
];

// Middleware to handle validation result
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  validateTask,
  handleValidation,
};