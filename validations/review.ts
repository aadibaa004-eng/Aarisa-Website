import { z } from "zod";

export const createReviewSchema = z.object({
  clientName: z
    .string({ required_error: "Client name is required" })
    .min(2, "Client name must be at least 2 characters")
    .trim(),
  review: z
    .string({ required_error: "Review text is required" })
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review cannot exceed 1000 characters")
    .trim(),
  rating: z
    .number({ required_error: "Rating is required" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
  weightLost: z.string().optional().default(""),
  city: z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters")
    .trim(),
});

export const updateReviewSchema = createReviewSchema
  .extend({
    approved: z.boolean().optional(),
  })
  .partial();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
