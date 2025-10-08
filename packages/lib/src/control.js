import { z } from "zod";
const isoDateTimeString = z.string().datetime({ offset: true });
export const controlStatusSchema = z.enum(["DRAFT", "REVIEW", "ACTIVE", "RETIRED"]);
export const controlSchema = z.object({
    id: z.string().cuid(),
    title: z.string().min(1),
    description: z.string().nullable(),
    frameworkId: z.string().cuid(),
    status: controlStatusSchema,
    createdAt: isoDateTimeString,
    updatedAt: isoDateTimeString
});
export const controlCreateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    frameworkId: z.string().cuid("frameworkId must be a valid CUID"),
    status: controlStatusSchema.default("DRAFT")
});
export const controlUpdateSchema = controlCreateSchema.partial();
