import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertMission, UpdateMissionRequest } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useMissions() {
  return useQuery({
    queryKey: [api.missions.list.path],
    queryFn: async () => {
      const res = await fetch(api.missions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch missions");
      const data = await res.json();
      return parseWithLogging(api.missions.list.responses[200], data, "missions.list");
    },
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMission) => {
      const validated = api.missions.create.input.parse(data);
      const res = await fetch(api.missions.create.path, {
        method: api.missions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create mission");
      const resData = await res.json();
      return parseWithLogging(api.missions.create.responses[201], resData, "missions.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.missions.list.path] });
    },
  });
}

export function useUpdateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateMissionRequest) => {
      const validated = api.missions.update.input.parse(updates);
      const url = buildUrl(api.missions.update.path, { id });
      const res = await fetch(url, {
        method: api.missions.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update mission");
      const resData = await res.json();
      return parseWithLogging(api.missions.update.responses[200], resData, "missions.update");
    },
    onMutate: async ({ id, completed }) => {
      // Optimistic update for toggling completion
      await queryClient.cancelQueries({ queryKey: [api.missions.list.path] });
      const previousMissions = queryClient.getQueryData([api.missions.list.path]);
      
      if (completed !== undefined) {
        queryClient.setQueryData([api.missions.list.path], (old: any) => {
          if (!old) return old;
          return old.map((m: any) => m.id === id ? { ...m, completed } : m);
        });
      }
      return { previousMissions };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousMissions) {
        queryClient.setQueryData([api.missions.list.path], context.previousMissions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.missions.list.path] });
    },
  });
}
