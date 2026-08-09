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
import { getConflictingUniqueField } from "../../utils/uniqueConstraint";
import { anonymizeUser } from "../../utils/anonymizeUser";
import { isAuth } from "../../middleware/auth.middleware";
import { registerSchema, loginSchema, updateMeSchema } from "./auth.schemas";

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
        const field = getConflictingUniqueField(err, ["username", "email"]);
        throw new AppError(
          field === "username"
            ? "Username already in use"
            : "Email already in use",
          409,
        );
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
  if (req.isAuthenticated() && req.user.isActive) {
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

// GET /api/auth/me/export - Right to data portability: download own data
authRouter.get(
  "/me/export",
  isAuth,
  asyncHandler(async (req, res) => {
    const user = await pg.getRepository(User).findOne({
      where: { id: req.user!.id },
      select: ["id", "email", "username", "role", "isActive", "createdAt"],
    });

    res.setHeader("Content-Disposition", 'attachment; filename="my-data.json"');
    res.json(user);
  }),
);

// PATCH /api/auth/me - Right to rectification: update own username
authRouter.patch(
  "/me",
  isAuth,
  validateBody(updateMeSchema),
  asyncHandler(async (req, res) => {
    const repo = pg.getRepository(User);
    const user = await repo.findOne({ where: { id: req.user!.id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.username = req.body.username;

    let result: User;
    try {
      result = await repo.save(user);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new AppError("Username already in use", 409);
      }
      throw err;
    }

    res.json({
      message: "Profile updated",
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        isActive: result.isActive,
        createdAt: result.createdAt,
      },
    });
  }),
);

// DELETE /api/auth/me - Right to erasure: anonymize own account and log out
authRouter.delete(
  "/me",
  isAuth,
  asyncHandler(async (req, res) => {
    const repo = pg.getRepository(User);
    const user = await repo.findOne({ where: { id: req.user!.id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await anonymizeUser(user);

    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: "Account erased but logout failed" });
        return;
      }
      res.json({ message: "Account erased" });
    });
  }),
);

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
