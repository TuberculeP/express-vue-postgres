import { Router } from "express";
import pg from "../../config/db.config";
import { AdminAuditLog } from "../../config/entities/AdminAuditLog";
import { asyncHandler } from "../../utils/asyncHandler";

const adminAuditLogRouter = Router();

// GET /api/admin/audit-log - Paginated history of admin actions on users
adminAuditLogRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const repo = pg.getRepository(AdminAuditLog);
    const [entries, total] = await repo.findAndCount({
      relations: ["actor"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        action: entry.action,
        targetUserId: entry.targetUserId,
        details: entry.details,
        createdAt: entry.createdAt,
        actor: { id: entry.actor.id, username: entry.actor.username },
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }),
);

export default adminAuditLogRouter;
