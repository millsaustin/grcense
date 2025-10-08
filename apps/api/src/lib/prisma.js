import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";
const logLevels = ["error", "warn"];
if (env.LOG_LEVEL === "info") {
    logLevels.push("info");
}
if (env.LOG_LEVEL === "debug") {
    logLevels.push("info", "query");
}
export const prisma = global.prisma ??
    new PrismaClient({
        log: [...new Set(logLevels)]
    });
if (env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
