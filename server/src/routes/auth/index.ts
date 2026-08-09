import { Router } from "express";
import { QueryFailedError } from "typeorm";
import { User } from "../../config/entities/User";
import pg from "../../config/db.config";
import bcrypt from "bcrypt";
import passport from "passport";
import { isGoogleAuthEnabled } from "../../config/passport.config";
import { validateBody } from "../../middleware/validate.middleware";
import { authLimiter } from "../../middleware/rateLimiter.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { registerSchema, loginSchema } from "./auth.schemas";

const authRouter = Router();

// Config endpoint - returns auth configuration for the frontend
authRouter.get("/config", (_req, res) => {
  res.json({
    googleAuthEnabled: isGoogleAuthEnabled(),
  });
});

authRouter.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    const newUser = new User();

    newUser.username = username;
    newUser.email = email;
    newUser.password = hash;

    const userRepository = pg.getRepository(User);

    let result: User;
    try {
      result = await userRepository.save(newUser);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const detail = String(
          (err as { driverError?: { detail?: string } }).driverError?.detail ??
            err.message,
        );
        if (detail.includes("username")) {
          throw new AppError("Username already in use", 409);
        }
        throw new AppError("Email already in use", 409);
      }
      throw err;
    }

    res.status(201).json({
      message: "User registered successfully",
      user: result,
    });
  }),
);

authRouter.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ message: "Already logged in", user: req.user });
      return;
    }
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({
        message: "Login successful",
        user: req.user,
      });
    } else {
      res.status(401).json({ message: "Login failed" });
    }
  },
);

authRouter.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      message: "User is authenticated",
      user: req.user,
    });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

authRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout failed", error: err });
      return;
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

// Google OAuth routes
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_auth_failed",
  }),
  (_req, res) => {
    res.redirect("/");
  },
);

export default authRouter;
