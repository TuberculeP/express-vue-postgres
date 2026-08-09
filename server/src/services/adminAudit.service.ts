import pg from "../config/db.config";
import { AdminAuditLog } from "../config/entities/AdminAuditLog";
import { User } from "../config/entities/User";

export async function logAdminAction(
  actor: User,
  action: string,
  targetUserId: string,
  details?: Record<string, unknown>,
): Promise<void> {
  const repo = pg.getRepository(AdminAuditLog);
  const entry = repo.create({
    actor,
    action,
    targetUserId,
    details: details ? JSON.stringify(details) : null,
  });
  await repo.save(entry);
}
