const express = require('express');
const router = express.Router();
const empController = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const validateEmployee = [
    check('first_name', 'First name is required').notEmpty(),
    check('last_name', 'Last name is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('position', 'Position is required').notEmpty(),
    check('salary', 'Salary must be a positive number').isNumeric().custom(v => v >= 0),
    check('date_of_joining', 'Valid date of joining is required').isISO8601(),
    check('department', 'Department is required').notEmpty()
];

router.get('/employees', auth, empController.getEmployees);
router.post('/employees', auth, validateEmployee, empController.createEmployee);
router.get('/employees/:eid', auth, empController.getEmployeeById);
router.put('/employees/:eid', auth, validateEmployee, empController.updateEmployee);
router.delete('/employees', auth, empController.deleteEmployee);

module.exports = router;