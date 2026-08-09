import { Router } from "express";
import { isAuth, isAdmin } from "../../middleware/auth.middleware";
import adminUsersRouter from "./users";
import adminAuditLogRouter from "./auditLog";

const adminRouter = Router();

// Apply auth + admin middleware to all admin routes
adminRouter.use(isAuth, isAdmin);

adminRouter.use("/users", adminUsersRouter);
adminRouter.use("/audit-log", adminAuditLogRouter);

export default adminRouter;
