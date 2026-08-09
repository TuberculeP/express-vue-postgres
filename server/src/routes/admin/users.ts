import { Router } from "express";
import pg from "../../config/db.config";
import { User } from "../../config/entities/User";
import { validateBody } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { anonymizeUser } from "../../utils/anonymizeUser";
import { logAdminAction } from "../../services/adminAudit.service";
import { updateUserSchema } from "./admin.schemas";

const adminUsersRouter = Router();

const USER_LIST_FIELDS = [
  "id",
  "email",
  "username",
  "role",
  "isActive",
  "createdAt",
] as const;

// GET /api/admin/users - List all users (paginated)
adminUsersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string | undefined;

    const repo = pg.getRepository(User);
    const query = repo
      .createQueryBuilder("user")
      .select(USER_LIST_FIELDS.map((field) => `user.${field}`))
      .orderBy("user.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.where(
        "LOWER(user.email) LIKE :search OR LOWER(user.username) LIKE :search",
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [users, total] = await query.getManyAndCount();

    res.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }),
);

// GET /api/admin/users/:id - Get a single user
adminUsersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await pg.getRepository(User).findOne({
      where: { id: req.params.id },
      select: [...USER_LIST_FIELDS],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({ user });
  }),
);

// PATCH /api/admin/users/:id - Update a user's role or active status
adminUsersRouter.patch(
  "/:id",
  validateBody(updateUserSchema),
  asyncHandler(async (req, res) => {
    const { role, isActive } = req.body;
    const repo = pg.getRepository(User);

    const user = await repo.findOne({ where: { id: req.params.id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (req.params.id === req.user!.id) {
      if (role !== undefined && role !== "ROLE_ADMIN") {
        throw new AppError("Cannot demote yourself", 400);
      }
      if (isActive === false) {
        throw new AppError("Cannot deactivate yourself", 400);
      }
    }

    if (role !== undefined && role !== user.role) {
      await logAdminAction(req.user!, "role_updated", user.id, {
        from: user.role,
        to: role,
      });
      user.role = role;
    }
    if (isActive !== undefined && isActive !== user.isActive) {
      await logAdminAction(
        req.user!,
        isActive ? "reactivated" : "deactivated",
        user.id,
      );
      user.isActive = isActive;
    }

    await repo.save(user);

    res.json({ user });
  }),
);

// DELETE /api/admin/users/:id - Soft delete (deactivate) a user, reversible
adminUsersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user!.id) {
      throw new AppError("Cannot delete yourself", 400);
    }

    const repo = pg.getRepository(User);
    const user = await repo.findOne({ where: { id: req.params.id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.isActive = false;
    await repo.save(user);
    await logAdminAction(req.user!, "deactivated", user.id);

    res.json({ message: "User deactivated" });
  }),
);

// POST /api/admin/users/:id/erase - Right to erasure: irreversible anonymization
adminUsersRouter.post(
  "/:id/erase",
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user!.id) {
      throw new AppError("Cannot erase yourself", 400);
    }

    const repo = pg.getRepository(User);
    const user = await repo.findOne({ where: { id: req.params.id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await anonymizeUser(user);
    await logAdminAction(req.user!, "anonymized", user.id);

    res.json({ message: "User data erased" });
  }),
);

export default adminUsersRouter;
