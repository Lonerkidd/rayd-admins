import { z } from 'zod';

// Define form validation schema
export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  client: z.string().min(1, "Client name is required"),
  videoLink: z.string().optional(),
  photoLink: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;