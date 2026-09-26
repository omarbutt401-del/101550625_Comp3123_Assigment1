//employeeModule.js
const fs = require("fs");

let employees = [];
try {
    const rawData = fs.readFileSync(__dirname + "/employees.json", "utf-8");
    employees = JSON.parse(rawData);
} catch (error) {
    employees = [
        { id: 1, firstName: "Omar", lastName: "Butt", salary: 75000 },
        { id: 2, firstName: "Laily", lastName: "Ajellu", salary: 85000 },
        { id: 3, firstName: "Alex", lastName: "Smith", salary: 60000 }
    ];
}

const getAllEmployees = () => {
    return employees;
};

const getEmployeeNames = () => {
    return employees
        .map(emp => `${emp.firstName} ${emp.lastName}`)
        .sort(); //Sort alphabetically asc order
};

const getTotalSalary = () => {
    return employees.reduce((total, emp) => total + (emp.salary || 0), 0);
};

module.exports = {
    getAllEmployees,
    getEmployeeNames,
    getTotalSalary
};
