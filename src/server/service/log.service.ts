import 'server-only';

import { db } from '@/db';
import { Log, logs, NewLog } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const LogService = {
  create: async (data: NewLog) => {
    const [inserted] = await db.insert(logs).values(data).returning();
    return inserted;
  },
  getAll: async (): Promise<Log[]> => {
    return db.query.logs.findMany({
      orderBy: [desc(logs.createdAt)],
    });
  },
};
