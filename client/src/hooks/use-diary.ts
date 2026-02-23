import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertDiaryEntry } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useDiaryEntries() {
  return useQuery({
    queryKey: [api.diary.list.path],
    queryFn: async () => {
      const res = await fetch(api.diary.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch diary entries");
      const data = await res.json();
      return parseWithLogging(api.diary.list.responses[200], data, "diary.list");
    },
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDiaryEntry) => {
      const validated = api.diary.create.input.parse(data);
      const res = await fetch(api.diary.create.path, {
        method: api.diary.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create diary entry");
      const resData = await res.json();
      return parseWithLogging(api.diary.create.responses[201], resData, "diary.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diary.list.path] });
    },
  });
}
