import Employee from "../model/employeemodel.js";
import asyncHandler from "express-async-handler";

/**
 * ✅ Create Employee
 */
export const createEmployee = asyncHandler(async (req, res) => {
  try {
    const { fname, lname, email, department, password, role } = req.body;

    console.log("🔍 Creating employee with email:", email);

    if (!fname || !lname || !email || !department || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    const newEmployee = new Employee({
      fname,
      lname,
      email,
      department,
      password,
      role,
    });
    await newEmployee.save();

    console.log("✅ Employee created:", newEmployee.email);

    res.status(201).json({
      message: "Employee created successfully",
      employee: { id: newEmployee._id, fname, lname, email, role, department },
    });
  } catch (error) {
    console.error("❌ Error creating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * ✅ Get All Employees
 */
export const getAllEmployees = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 Fetching all employees...");
    const employees = await Employee.find().select("-password");

    console.log(`✅ Found ${employees.length} employees`);
    res.status(200).json(employees);
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * ✅ Get Single Employee by ID
 */
export const getEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * ✅ Update Employee
 */
export const updateEmployee = asyncHandler(async (req, res) => {
  try {
    const { fname, lname, department, role } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { fname, lname, department, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res
      .status(200)
      .json({
        message: "Employee updated successfully",
        employee: updatedEmployee,
      });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * ✅ Delete Employee
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * ✅ Get Last 5 Admins
 */
export const getLastAdmins = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 Fetching last 5 admins...");
    const admins = await Employee.find({ role: "admin" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    res.status(200).json(admins);
  } catch (error) {
    console.error("❌ Error fetching last admins:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
