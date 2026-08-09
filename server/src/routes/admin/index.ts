import { Router } from "express";
import { isAuth, isAdmin } from "../../middleware/auth.middleware";
import adminUsersRouter from "./users";

const adminRouter = Router();

// Apply auth + admin middleware to all admin routes
adminRouter.use(isAuth, isAdmin);

adminRouter.use("/users", adminUsersRouter);

export default adminRouter;
