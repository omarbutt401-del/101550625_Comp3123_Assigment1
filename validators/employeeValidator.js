const { body } = require('express-validator');

exports.employeeValidator = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name too long'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name too long'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('position')
    .trim()
    .notEmpty().withMessage('Position is required'),

  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isNumeric().withMessage('Salary must be a number')
    .custom(v => Number(v) >= 0).withMessage('Salary must be positive'),

  body('date_of_joining')
    .notEmpty().withMessage('Date of joining is required')
    .isISO8601().withMessage('Date of joining must be a valid date'),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
];