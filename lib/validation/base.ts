import { z } from "zod";

export const nonEmptyString = z.string().trim().min(1);
export const optionalNonEmptyString = z.string().trim().min(1).optional();
export const bigIntIdSchema = z.coerce.number().int().positive();
export const uuidSchema = z.string().uuid();

export const paginatedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
