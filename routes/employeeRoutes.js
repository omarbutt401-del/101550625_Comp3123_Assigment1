const express = require('express');
const router = express.Router();
const empController = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const { employeeValidator } = require('../validators/employeeValidator');

router.get('/employees',        auth, empController.getEmployees);
router.post('/employees',       auth, employeeValidator, empController.createEmployee);
router.get('/employees/:eid',   auth, empController.getEmployeeById);
router.put('/employees/:eid',   auth, employeeValidator, empController.updateEmployee);
router.delete('/employees',     auth, empController.deleteEmployee);

module.exports = router;
