import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("hr_user"), // admin, hr_user
  createdAt: timestamp("created_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  dateOfBirth: text("date_of_birth"),
  ssn: text("ssn"),
  address: text("address"),
  phone: text("phone"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const backgroundJobs = pgTable("background_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  status: text("status").notNull().default("queued"), // queued, processing, complete, failed
  riskScore: integer("risk_score"), // 1-10 scale
  riskLevel: text("risk_level"), // low, medium, high
  report: text("report"), // JSON string of the full report
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  role: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  name: true,
  email: true,
  dateOfBirth: true,
  ssn: true,
  address: true,
  phone: true,
});

export const insertBackgroundJobSchema = createInsertSchema(backgroundJobs).pick({
  employeeId: true,
  status: true,
  riskScore: true,
  riskLevel: true,
  report: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertBackgroundJob = z.infer<typeof insertBackgroundJobSchema>;
export type BackgroundJob = typeof backgroundJobs.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
