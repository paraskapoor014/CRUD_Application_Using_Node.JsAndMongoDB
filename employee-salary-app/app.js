const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Helper function to read employee data from the JSON file
const getEmployees = () => {
  const data = fs.readFileSync('employees.json');
  return JSON.parse(data);
};

// Helper function to write employee data to the JSON file
const saveEmployees = (employees) => {
  fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2));
};

app.get("/", (req,res) => {
  res.sendFile(__dirname + "/index.html")
})

// Get all employees
app.get('/employees', (req, res) => {
  const employees = getEmployees();
  res.json(employees);
});

// Add a new employee
app.post('/employees', (req, res) => {
  const employees = getEmployees();
  const newEmployee = {
    id: employees.length + 1,
    name: req.body.name,
    position: req.body.position,
    salary: req.body.salary
  };
  employees.push(newEmployee);
  saveEmployees(employees);
  res.json(newEmployee);
});

// Update employee salary
app.put('/employees/:id/salary', (req, res) => {
  const employees = getEmployees();
  const employeeId = parseInt(req.params.id);
  const newSalary = req.body.salary;

  const employee = employees.find(emp => emp.id === employeeId);
  if (employee) {
    employee.salary = newSalary;
    saveEmployees(employees);
    res.json({ message: 'Salary updated successfully', employee });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
  const employees = getEmployees();
  const employeeId = parseInt(req.params.id);

  const updatedEmployees = employees.filter(emp => emp.id !== employeeId);

  if (updatedEmployees.length === employees.length) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  saveEmployees(updatedEmployees);
  res.json({ message: 'Employee deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
