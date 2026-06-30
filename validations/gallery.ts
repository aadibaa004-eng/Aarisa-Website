import { z } from "zod";

export const createGallerySchema = z.object({
  image: z
    .string({ required_error: "Image URL is required" })
    .url("Image must be a valid URL"),
  caption: z
    .string()
    .max(300, "Caption cannot exceed 300 characters")
    .optional()
    .default(""),
  type: z.enum(["before", "after", "general"], {
    required_error: "Type is required",
    invalid_type_error: "Type must be before, after, or general",
  }),
});

export const updateGallerySchema = createGallerySchema.partial();

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
