import type { Request, Response } from "express";
import { Router } from "express";

import {
  controlCreateSchema,
  controlSchema,
  createErrorResponse,
  createSuccessResponse
} from "@grcense/lib";

import { prisma } from "../lib/prisma";

export const controlsRouter = Router();

type ControlRecord = Awaited<ReturnType<typeof prisma.control.findMany>>[number];

controlsRouter.get("/", async (_req, res) => {
  const controls = await prisma.control.findMany({
    orderBy: { createdAt: "desc" }
  });

  const payload = controls.map((control: ControlRecord) =>
    controlSchema.parse({
      ...control,
      createdAt: control.createdAt.toISOString(),
      updatedAt: control.updatedAt.toISOString()
    })
  );

  res.json(createSuccessResponse(payload));
});

controlsRouter.post("/", async (req: Request, res: Response) => {
  const parsed = controlCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(
      createErrorResponse("Invalid request body", "VALIDATION_ERROR", parsed.error.flatten().fieldErrors)
    );
  }

  try {
    const created = await prisma.control.create({
      data: parsed.data
    });

    return res.status(201).json(
      createSuccessResponse(
        controlSchema.parse({
          ...created,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString()
        })
      )
    );
  } catch (error) {
    console.error("Failed to create control", error);
    return res.status(500).json(
      createErrorResponse("Failed to create control", "INTERNAL_SERVER_ERROR")
    );
  }
});
