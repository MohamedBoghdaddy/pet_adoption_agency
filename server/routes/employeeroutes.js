import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  getLastAdmins,
} from "../controller/employeecontroller.js";
import { isAuthenticated, verifyAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ✅ Apply authentication middleware
router.post("/create", isAuthenticated, verifyAdmin, createEmployee);
router.get("/getall", isAuthenticated, getAllEmployees);
router.get("/getone/:id", isAuthenticated, getEmployee);
router.put("/update/:id", isAuthenticated, verifyAdmin, updateEmployee);
router.delete("/delete/:id", isAuthenticated, verifyAdmin, deleteEmployee);
router.get("/lastadmins", isAuthenticated, verifyAdmin, getLastAdmins);

export default router;
