import { db } from "./db";
import {
  missions, diaryEntries,
  type InsertMission,
  type UpdateMissionRequest,
  type Mission,
  type InsertDiaryEntry,
  type DiaryEntry
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getMissions(): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: number, updates: UpdateMissionRequest): Promise<Mission>;
  getDiaryEntries(): Promise<DiaryEntry[]>;
  createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry>;
}

export class DatabaseStorage implements IStorage {
  async getMissions(): Promise<Mission[]> {
    return await db.select().from(missions).orderBy(desc(missions.createdAt));
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const [newMission] = await db.insert(missions).values(mission).returning();
    return newMission;
  }

  async updateMission(id: number, updates: UpdateMissionRequest): Promise<Mission> {
    const [updated] = await db.update(missions)
      .set(updates)
      .where(eq(missions.id, id))
      .returning();
    if (!updated) throw new Error("Mission not found");
    return updated;
  }

  async getDiaryEntries(): Promise<DiaryEntry[]> {
    return await db.select().from(diaryEntries).orderBy(desc(diaryEntries.createdAt));
  }

  async createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry> {
    const [newEntry] = await db.insert(diaryEntries).values(entry).returning();
    return newEntry;
  }
}

export const storage = new DatabaseStorage();
