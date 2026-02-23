import { z } from 'zod';
import { insertMissionSchema, insertDiaryEntrySchema, missions, diaryEntries } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  missions: {
    list: {
      method: 'GET' as const,
      path: '/api/missions' as const,
      responses: {
        200: z.array(z.custom<typeof missions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/missions' as const,
      input: insertMissionSchema,
      responses: {
        201: z.custom<typeof missions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/missions/:id' as const,
      input: insertMissionSchema.partial(),
      responses: {
        200: z.custom<typeof missions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  diary: {
    list: {
      method: 'GET' as const,
      path: '/api/diary' as const,
      responses: {
        200: z.array(z.custom<typeof diaryEntries.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/diary' as const,
      input: insertDiaryEntrySchema,
      responses: {
        201: z.custom<typeof diaryEntries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type MissionResponse = z.infer<typeof api.missions.create.responses[201]>;
export type DiaryEntryResponse = z.infer<typeof api.diary.create.responses[201]>;
