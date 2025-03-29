import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { logStatusEnum } from '@/db/schema/enums';

export const logs = pgTable('logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('userId', { length: 255 }),
  title: varchar('title', { length: 255 }).notNull(),
  message: varchar('message', { length: 255 }),
  context : text('context'),
  ip_address : varchar('ip_address ', { length: 255 }),
  request_url : varchar('request_url ', { length: 255 }),
  request_method : varchar('request_method ', { length: 255 }),
  status: logStatusEnum('log_status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
