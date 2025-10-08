import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { controlsRouter } from "./routes/controls";
import { healthRouter } from "./routes/health";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.NODE_ENV === "development" ? [/^http:\/\/localhost:\d+$/] : undefined,
      credentials: true
    })
  );
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "grcense-api",
      version: "0.1.0",
      status: "ok"
    });
  });

  app.use("/health", healthRouter);
  app.use("/api/v1/controls", controlsRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error", err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
