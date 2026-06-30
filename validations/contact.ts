import { z } from "zod";

export const createContactSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(7, "Please enter a valid phone number")
    .trim(),
  goal: z
    .string({ required_error: "Goal is required" })
    .min(5, "Goal must be at least 5 characters")
    .trim(),
  message: z
    .string({ required_error: "Message is required" })
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters")
    .trim(),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be new, contacted, or closed",
  }),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>;
