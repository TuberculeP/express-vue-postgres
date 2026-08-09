import pg from "../config/db.config";
import { User } from "../config/entities/User";

/**
 * Right-to-erasure helper: scrubs personal data while keeping the row so
 * foreign keys (e.g. Upload.user) stay valid. Irreversible.
 */
export async function anonymizeUser(user: User): Promise<User> {
  // Reuse the (already-unique) id rather than a truncated/random value, so
  // this can never collide with another row's unique email/username.
  user.email = `deleted-${user.id}@anonymized.local`;
  user.username = `deleted_${user.id}`;
  user.password = null;
  user.googleId = null;
  user.isActive = false;

  return pg.getRepository(User).save(user);
}
