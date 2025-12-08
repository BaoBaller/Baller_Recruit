import {
  adminUsers,
  heroes,
  jobs,
  type AdminUser,
  type InsertAdminUser,
  type Hero,
  type InsertHero,
  type Job,
  type InsertJob,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  getHero(): Promise<Hero | undefined>;
  upsertHero(hero: InsertHero): Promise<Hero>;

  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  async getHero(): Promise<Hero | undefined> {
    const [hero] = await db.select().from(heroes).limit(1);
    return hero || undefined;
  }

  async upsertHero(heroData: InsertHero): Promise<Hero> {
    const existingHero = await this.getHero();
    if (existingHero) {
      const [updated] = await db
        .update(heroes)
        .set(heroData)
        .where(eq(heroes.id, existingHero.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(heroes).values(heroData).returning();
      return created;
    }
  }

  async getJobs(): Promise<Job[]> {
    return db.select().from(jobs);
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set(jobData)
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
