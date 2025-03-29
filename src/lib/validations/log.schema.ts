import { logs } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CreateLogSchema = createInsertSchema(logs).pick({
  status: true,
  ip_address: true,
  userId: undefined,
  title: true,
  message: true,
  request_url: true,
});

export type CreateLogInput = z.infer<typeof CreateLogSchema>;
