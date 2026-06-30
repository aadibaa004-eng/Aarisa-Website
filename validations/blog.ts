import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters")
    .trim(),
  excerpt: z
    .string({ required_error: "Excerpt is required" })
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt cannot exceed 500 characters")
    .trim(),
  content: z
    .string({ required_error: "Content is required" })
    .min(50, "Content must be at least 50 characters")
    .trim(),
  thumbnail: z
    .string()
    .url("Thumbnail must be a valid URL")
    .optional()
    .or(z.literal("")),
  category: z
    .string({ required_error: "Category is required" })
    .min(2, "Category must be at least 2 characters")
    .trim(),
  author: z
    .string({ required_error: "Author is required" })
    .min(2, "Author must be at least 2 characters")
    .trim(),
  published: z.boolean().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
