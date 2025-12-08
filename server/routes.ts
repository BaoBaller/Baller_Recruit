import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateAdmin, requireAuth, getCurrentUser } from "./auth";
import { insertHeroSchema, insertJobSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await authenticateAdmin(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/hero", async (req, res) => {
    try {
      const hero = await storage.getHero();
      if (!hero) {
        return res.status(404).json({ error: "Hero not found" });
      }
      res.json(hero);
    } catch (error) {
      console.error("Get hero error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/hero", requireAuth, async (req, res) => {
    try {
      const result = insertHeroSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const hero = await storage.upsertHero(result.data);
      res.json(hero);
    } catch (error) {
      console.error("Update hero error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/jobs", requireAuth, async (req, res) => {
    try {
      const result = insertJobSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const job = await storage.createJob(result.data);
      res.status(201).json(job);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/jobs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const existingJob = await storage.getJob(id);
      if (!existingJob) {
        return res.status(404).json({ error: "Job not found" });
      }

      const job = await storage.updateJob(id, req.body);
      res.json(job);
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/jobs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const existingJob = await storage.getJob(id);
      if (!existingJob) {
        return res.status(404).json({ error: "Job not found" });
      }

      const job = await storage.updateJob(id, req.body);
      res.json(job);
    } catch (error) {
      console.error("Patch job error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/jobs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const deleted = await storage.deleteJob(id);
      if (!deleted) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete job error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
