import { type User, type InsertUser, type Employee, type InsertEmployee, type BackgroundJob, type InsertBackgroundJob } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Employee operations
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployees(limit?: number): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee & { uploadedBy: string }): Promise<Employee>;
  
  // Background job operations
  getBackgroundJob(id: string): Promise<BackgroundJob | undefined>;
  getBackgroundJobs(limit?: number): Promise<BackgroundJob[]>;
  getBackgroundJobsByEmployee(employeeId: string): Promise<BackgroundJob[]>;
  createBackgroundJob(job: InsertBackgroundJob): Promise<BackgroundJob>;
  updateBackgroundJob(id: string, updates: Partial<BackgroundJob>): Promise<BackgroundJob | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private employees: Map<string, Employee>;
  private backgroundJobs: Map<string, BackgroundJob>;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.backgroundJobs = new Map();
    
    // Create default admin user
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      email: "admin@example.com",
      password: "admin123", // In real app, this would be hashed
      name: "Admin User",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminId, adminUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "hr_user",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployees(limit = 50): Promise<Employee[]> {
    return Array.from(this.employees.values()).slice(0, limit);
  }

  async createEmployee(employee: InsertEmployee & { uploadedBy: string }): Promise<Employee> {
    const id = randomUUID();
    const newEmployee: Employee = {
      ...employee,
      id,
      address: employee.address || null,
      dateOfBirth: employee.dateOfBirth || null,
      ssn: employee.ssn || null,
      phone: employee.phone || null,
      uploadedBy: employee.uploadedBy || null,
      createdAt: new Date(),
    };
    this.employees.set(id, newEmployee);
    return newEmployee;
  }

  async getBackgroundJob(id: string): Promise<BackgroundJob | undefined> {
    return this.backgroundJobs.get(id);
  }

  async getBackgroundJobs(limit = 50): Promise<BackgroundJob[]> {
    return Array.from(this.backgroundJobs.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getBackgroundJobsByEmployee(employeeId: string): Promise<BackgroundJob[]> {
    return Array.from(this.backgroundJobs.values())
      .filter(job => job.employeeId === employeeId);
  }

  async createBackgroundJob(job: InsertBackgroundJob): Promise<BackgroundJob> {
    const id = randomUUID();
    const newJob: BackgroundJob = {
      ...job,
      id,
      status: job.status || "queued",
      riskScore: job.riskScore || null,
      riskLevel: job.riskLevel || null,
      report: job.report || null,
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
    };
    this.backgroundJobs.set(id, newJob);
    
    // Simulate background processing
    setTimeout(() => {
      this.simulateJobProcessing(id);
    }, Math.random() * 5000 + 2000); // 2-7 seconds
    
    return newJob;
  }

  async updateBackgroundJob(id: string, updates: Partial<BackgroundJob>): Promise<BackgroundJob | undefined> {
    const job = this.backgroundJobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.backgroundJobs.set(id, updatedJob);
    return updatedJob;
  }

  private async simulateJobProcessing(jobId: string): Promise<void> {
    const job = this.backgroundJobs.get(jobId);
    if (!job) return;

    // Update to processing
    await this.updateBackgroundJob(jobId, {
      status: "processing",
      startedAt: new Date(),
    });

    // Simulate processing time
    setTimeout(async () => {
      const riskScore = Math.floor(Math.random() * 10) + 1;
      const riskLevel = riskScore <= 3 ? "low" : riskScore <= 7 ? "medium" : "high";
      
      const mockReport = {
        identity: {
          verified: true,
          confidence: 0.95,
        },
        employment: {
          verified: true,
          positions: [
            {
              company: "TechCorp Solutions",
              position: "Senior Marketing Manager",
              duration: "2020 - Present",
              verified: true,
            }
          ],
        },
        socialMedia: {
          linkedin: "professional",
          twitter: "clean",
          facebook: "private",
        },
        criminal: {
          records: false,
          verified: true,
        },
        summary: `Background check completed with ${riskLevel} risk assessment.`,
      };

      await this.updateBackgroundJob(jobId, {
        status: "complete",
        riskScore,
        riskLevel,
        report: JSON.stringify(mockReport),
        completedAt: new Date(),
      });
    }, Math.random() * 10000 + 5000); // 5-15 seconds processing
  }
}

export const storage = new MemStorage();
