import { z } from "zod";

export const successResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
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

export type ApiSuccessResponse<T> = {
  data: T;
  error: null;
};

export type ApiErrorResponse = z.infer<typeof errorResponseSchema>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const createSuccessResponse = <T>(payload: T): ApiSuccessResponse<T> => ({
  data: payload,
  error: null
});

export const createErrorResponse = (
  message: string,
  code = "UNKNOWN",
  details?: Record<string, unknown>
): ApiErrorResponse => ({
  data: null,
  error: {
    message,
    code,
    details
  }
});
