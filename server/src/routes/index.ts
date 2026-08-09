import { Router } from "express";
import authRouter from "./auth";
import sharedRouter from "./shared";
import adminRouter from "./admin";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    message: "Hello from the server!",
  });
});

router.use("/auth", authRouter);
router.use("/shared", sharedRouter);
router.use("/admin", adminRouter);

export default router;
