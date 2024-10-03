const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/employeesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Define employee schema and model (remove the manual 'id')
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new employee
app.post('/employees', async (req, res) => {
  const newEmployee = new Employee({
    name: req.body.name,
    position: req.body.position,
    salary: req.body.salary
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update employee salary
app.put('/employees/:id/salary', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { salary: req.body.salary },
      { new: true }
    );
    if (updatedEmployee) {
      res.json({ message: 'Salary updated successfully', updatedEmployee });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (deletedEmployee) {
      res.json({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
