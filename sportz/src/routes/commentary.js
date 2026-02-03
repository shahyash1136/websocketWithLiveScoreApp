import { Router } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";
import { commentary } from "../db/schema.js";
import { db } from "../db/db.js";
import { desc, eq } from "drizzle-orm";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse({
    id: req.params.matchId,
  });

  if (!paramsParsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid params.", details: paramsParsed.error.issues });
  }

  const queryParsed = listCommentaryQuerySchema.safeParse(req.query);

  if (!queryParsed.success) {
    return res.status(400).json({
      error: "Invalid Query.",
      details: queryParsed.error.issues,
    });
  }

  const limit = Math.min(queryParsed.data.limit ?? 100, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, paramsParsed.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: "Failed to list commentary." });
  }
});

commentaryRouter.post("/", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse({
    id: req.params.matchId,
  });

  if (!paramsParsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid params.", details: paramsParsed.error.issues });
  }

  const bodyParsed = createCommentarySchema.safeParse(req.body);

  if (!bodyParsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid payload.", details: bodyParsed.error.issues });
  }

  const { sequence, period, eventType, tags, ...rest } = bodyParsed.data;

  try {
    const [entry] = await db
      .insert(commentary)
      .values({
        matchId: paramsParsed.data.id,
        ...rest,
        sequence: sequence ?? 0,
        period: period ?? "unknown",
        eventType: eventType ?? "unknown",
        tags: tags ? JSON.stringify(tags) : null,
      })
      .returning();

    if (res.app.locals.broadcastCommentary) {
      res.app.locals.broadcastCommentary(entry.matchId, entry);
    }

    res.status(201).json({ data: entry });
  } catch (e) {
    res.status(500).json({
      error: "Failed to create commentary.",
      details: JSON.stringify(e),
    });
  }
});
