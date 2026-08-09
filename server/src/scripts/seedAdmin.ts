import bcrypt from "bcrypt";
import pg from "../config/db.config";
import { User } from "../config/entities/User";
import { generateUniqueUsername } from "../utils/username";

export async function seedDefaultAdmin(): Promise<void> {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("[Seed] No DEFAULT_ADMIN env vars, skipping");
    return;
  }

  const repo = pg.getRepository(User);
  const existing = await repo.findOne({ where: { email } });

  if (existing) {
    if (existing.role !== "ROLE_ADMIN") {
      existing.role = "ROLE_ADMIN";
      await repo.save(existing);
      console.log(`[Seed] Updated ${email} to ROLE_ADMIN`);
    }
    return;
  }

  const admin = repo.create({
    email,
    password: bcrypt.hashSync(password, 10),
    username: await generateUniqueUsername("admin"),
    role: "ROLE_ADMIN",
    isActive: true,
  });
  await repo.save(admin);
  console.log(`[Seed] Created admin: ${email}`);
}
