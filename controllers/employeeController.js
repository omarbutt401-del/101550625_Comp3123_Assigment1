const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

// GET all employees belonging to the authenticated user
exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find({ user: req.user.id });
        return res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

// POST create a new employee tied to the authenticated user
exports.createEmployee = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
        const newEmployee = new Employee({
            ...req.body,
            user: req.user.id
        });
        await newEmployee.save();
        return res.status(201).json({
            status: true,
            message: 'Employee created successfully.',
            employee_id: newEmployee._id
        });
    } catch (error) {
        next(error);
    }
};

// GET one employee by ID (owner only)
exports.getEmployeeById = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.eid)) {
        return res.status(400).json({ status: false, message: 'Invalid employee ID format.' });
    }
    try {
        const employee = await Employee.findOne({ _id: req.params.eid, user: req.user.id });
        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found or unauthorized.' });
        }
        return res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
};

// PUT update employee (owner only)
exports.updateEmployee = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.eid)) {
        return res.status(400).json({ status: false, message: 'Invalid employee ID format.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
        const employee = await Employee.findOneAndUpdate(
            { _id: req.params.eid, user: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found or unauthorized.' });
        }
        return res.status(200).json({ status: true, message: 'Employee updated successfully.' });
    } catch (error) {
        next(error);
    }
};

// DELETE employee (owner only) — reads ?eid=xxx
exports.deleteEmployee = async (req, res, next) => {
    const { eid } = req.query;
    if (!eid) {
        return res.status(400).json({ status: false, message: 'Missing employee ID parameter (eid).' });
    }
    if (!mongoose.Types.ObjectId.isValid(eid)) {
        return res.status(400).json({ status: false, message: 'Invalid employee ID format.' });
    }

    try {
        const employee = await Employee.findOneAndDelete({ _id: eid, user: req.user.id });
        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found or unauthorized.' });
        }
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};