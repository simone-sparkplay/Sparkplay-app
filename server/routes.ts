import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.missions.list.path, async (req, res) => {
    const allMissions = await storage.getMissions();
    res.json(allMissions);
  });

  app.post(api.missions.create.path, async (req, res) => {
    try {
      const input = api.missions.create.input.parse(req.body);
      const mission = await storage.createMission(input);
      res.status(201).json(mission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.missions.update.path, async (req, res) => {
    try {
      const input = api.missions.update.input.parse(req.body);
      const mission = await storage.updateMission(Number(req.params.id), input);
      res.json(mission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      if (err instanceof Error && err.message === "Mission not found") {
        return res.status(404).json({ message: err.message });
      }
      throw err;
    }
  });

  app.get(api.diary.list.path, async (req, res) => {
    const entries = await storage.getDiaryEntries();
    res.json(entries);
  });

  app.post(api.diary.create.path, async (req, res) => {
    try {
      const input = api.diary.create.input.parse(req.body);
      const entry = await storage.createDiaryEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data asynchronously
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingMissions = await storage.getMissions();
  if (existingMissions.length === 0) {
    await storage.createMission({ title: "Bevi un bicchiere d'acqua", completed: false });
    await storage.createMission({ title: "Fai una passeggiata di 10 minuti", completed: false });
    await storage.createMission({ title: "Leggi 5 pagine di un libro", completed: false });
  }

  const existingEntries = await storage.getDiaryEntries();
  if (existingEntries.length === 0) {
    await storage.createDiaryEntry({ content: "Oggi ho iniziato una nuova avventura con SparkPlay! Sono molto emozionato di completare le mie missioni." });
  }
}
