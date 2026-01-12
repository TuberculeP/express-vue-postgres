import { Router } from "express";
import { User } from "../../config/entities/User";
import pg from "../../config/db.config";
import bcrypt from "bcrypt";
import passport from "passport";
import { isGoogleAuthEnabled } from "../../config/passport.config";

const authRouter = Router();

// Config endpoint - returns auth configuration for the frontend
authRouter.get("/config", (_req, res) => {
  res.json({
    googleAuthEnabled: isGoogleAuthEnabled(),
  });
});

authRouter.post("/register", async (req, res) => {
  // Validate user
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const hash = bcrypt.hashSync(password, 10);

  const newUser = new User();

  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.email = email;
  newUser.password = hash;

  // Save user to the database
  const userRepository = pg.getRepository(User);
  const result = await userRepository.save(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: result,
  });
});

authRouter.post(
  "/login",
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
