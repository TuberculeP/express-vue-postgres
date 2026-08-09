import { z } from "zod";

export const updateUserSchema = z.object({
  role: z.enum(["ROLE_USER", "ROLE_ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});
