import { pgTable, text, varchar, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// AdminUser - for admin authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Hero - bilingual hero section
export const heroes = pgTable("heroes", {
  id: serial("id").primaryKey(),
  titleVi: text("title_vi").notNull(),
  titleEn: text("title_en").notNull(),
  subtitleVi: text("subtitle_vi").notNull(),
  subtitleEn: text("subtitle_en").notNull(),
  backgroundType: text("background_type").notNull().default("image"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  ctaTextVi: text("cta_text_vi").notNull(),
  ctaTextEn: text("cta_text_en").notNull(),
  ctaLink: text("cta_link").notNull(),
});

export const insertHeroSchema = createInsertSchema(heroes).omit({
  id: true,
});

export type InsertHero = z.infer<typeof insertHeroSchema>;
export type Hero = typeof heroes.$inferSelect;

// Job - bilingual job postings
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  jobTitleVi: text("job_title_vi").notNull(),
  jobTitleEn: text("job_title_en").notNull(),
  departmentVi: text("department_vi").notNull(),
  departmentEn: text("department_en").notNull(),
  locationVi: text("location_vi").notNull(),
  locationEn: text("location_en").notNull(),
  salaryVi: text("salary_vi").notNull(),
  salaryEn: text("salary_en").notNull(),
  descriptionVi: text("description_vi").notNull(),
  descriptionEn: text("description_en").notNull(),
  requirementsVi: text("requirements_vi").notNull(),
  requirementsEn: text("requirements_en").notNull(),
  applyEmail: text("apply_email"),
  applyLink: text("apply_link"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Job Applications - for applicant tracking
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: serial("job_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url"),
  resumeFilename: text("resume_filename"),
  coverLetter: text("cover_letter"),
  status: text("status").notNull().default("new"),
  appliedAt: text("applied_at").notNull(),
  notes: text("notes"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Legacy users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
