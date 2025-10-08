import { z } from "zod";
const isoDateTimeString = z.string().datetime({ offset: true });
export const frameworkSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().nullable(),
    createdAt: isoDateTimeString,
    updatedAt: isoDateTimeString
});
export const frameworkCreateSchema = frameworkSchema.pick({
    name: true,
    slug: true,
    description: true
});
export const frameworkUpdateSchema = frameworkCreateSchema.partial();
