import { Router } from "express";
import { prisma } from "../lib/prisma";
export const healthRouter = Router();
healthRouter.get("/", async (_req, res) => {
    const start = process.hrtime.bigint();
    await prisma.$queryRaw `SELECT 1`;
    const durationNs = Number(process.hrtime.bigint() - start);
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        latencyMs: durationNs / 1_000_000
    });
});
