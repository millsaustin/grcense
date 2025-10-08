import { z } from "zod";
export const successResponseSchema = (schema) => z.object({
    data: schema,
    error: z.null()
});
export const errorResponseSchema = z.object({
    data: z.null(),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.any()).optional()
    })
});
export const createSuccessResponse = (payload) => ({
    data: payload,
    error: null
});
export const createErrorResponse = (message, code = "UNKNOWN", details) => ({
    data: null,
    error: {
        message,
        code,
        details
    }
});
