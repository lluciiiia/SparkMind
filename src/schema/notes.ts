import { z } from 'zod';

export const NoteSchema = z.object({
  id: z.number().optional().readonly(),
  uuid: z.string(),
  title: z.string(),
  content: z.array(z.string()).nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type NoteType = z.infer<typeof NoteSchema>;