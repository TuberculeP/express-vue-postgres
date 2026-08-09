import { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  // Catches accounts deactivated after the session was created.
  if (!req.user?.isActive) {
    res.status(401).json({ message: "Account is deactivated" });
    return;
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ROLE_ADMIN") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
};
