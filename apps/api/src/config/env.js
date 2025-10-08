import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z
        .string()
        .min(1, "DATABASE_URL is required")
        .default("file:./dev.db"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("debug")
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
    throw new Error("Environment validation failed");
}
export const env = parsed.data;
