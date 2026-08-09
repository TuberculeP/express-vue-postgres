import pg from "../config/db.config";
import { User } from "../config/entities/User";

const DIACRITICS_REGEX = /[̀-ͯ]/g;

function slugify(base: string): string {
  const slug = base
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  const trimmed = slug.slice(0, 20);
  return trimmed.length >= 3 ? trimmed : `${trimmed}user`.slice(0, 20);
}

export async function generateUniqueUsername(base: string): Promise<string> {
  const repo = pg.getRepository(User);
  const slug = slugify(base);

  let candidate = slug;
  let attempt = 0;

  while (await repo.findOne({ where: { username: candidate } })) {
    attempt += 1;
    const suffix = String(attempt);
    candidate = `${slug.slice(0, 20 - suffix.length)}${suffix}`;
  }

  return candidate;
}
