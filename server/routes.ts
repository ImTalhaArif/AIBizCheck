import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertEmployeeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd set a session or JWT here
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", (req, res) => {
    // Mock authenticated user - in real app, check session/JWT
    res.json({
      user: {
        id: "admin-id",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      }
    });
  });

  // Employee endpoints
  app.get("/api/employees", async (req, res) => {
    const employees = await storage.getEmployees();
    res.json({ employees });
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee({
        ...employeeData,
        uploadedBy: "admin-id", // Mock user ID
      });
      res.json({ employee });
    } catch (error) {
      res.status(400).json({ message: "Invalid employee data" });
    }
  });

  // Upload endpoint
  app.post("/api/upload", async (req, res) => {
    try {
      const { employees: employeeList } = req.body;
      
      if (!Array.isArray(employeeList)) {
        return res.status(400).json({ message: "Expected array of employees" });
      }

      const results = [];
      for (const employeeData of employeeList) {
        try {
          const validatedEmployee = insertEmployeeSchema.parse(employeeData);
          const employee = await storage.createEmployee({
            ...validatedEmployee,
            uploadedBy: "admin-id",
          });
          
          // Create background job for each employee
          const job = await storage.createBackgroundJob({
            employeeId: employee.id,
            status: "queued",
          });
          
          results.push({ employee, job });
        } catch (error) {
          console.error("Error processing employee:", error);
        }
      }

      res.json({ 
        message: `Successfully queued ${results.length} background checks`,
        results 
      });
    } catch (error) {
      res.status(400).json({ message: "Upload failed" });
    }
  });

  // Jobs endpoints
  app.get("/api/jobs", async (req, res) => {
    const jobs = await storage.getBackgroundJobs();
    const jobsWithEmployees = [];
    
    for (const job of jobs) {
      const employee = await storage.getEmployee(job.employeeId);
      jobsWithEmployees.push({
        ...job,
        employee,
      });
    }
    
    res.json({ jobs: jobsWithEmployees });
  });

  // Reports endpoints
  app.get("/api/reports/:id", async (req, res) => {
    const { id } = req.params;
    const job = await storage.getBackgroundJob(id);
    
    if (!job) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    const employee = await storage.getEmployee(job.employeeId);
    
    res.json({
      job,
      employee,
      report: job.report ? JSON.parse(job.report) : null,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
