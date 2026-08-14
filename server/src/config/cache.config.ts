// The configuration for the cache system: Redis when REDIS_URL is set, SQLite otherwise

import "dotenv/config";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const DEFAULT_TLL = 60 * 60 * 24; // 1 day in seconds
const DEFAULT_PREFIX = "sess:";

const createStore = async () => {
  const { REDIS_URL } = process.env;
  if (REDIS_URL) {
    const redisClient = createClient({ url: REDIS_URL });
    redisClient.connect().catch(console.error);

    return new RedisStore({
      client: redisClient,
      prefix: DEFAULT_PREFIX,
      ttl: DEFAULT_TLL,
    });
  } else {
    // Loaded lazily via dynamic import: sqlite3 pulls in a native binding
    // that must never be touched in Docker, where REDIS_URL is always set
    // (see docker-compose.yml). A plain require() here would also bypass
    // esModuleInterop and hand back { default: fn } instead of fn.
    const [{ default: sqlite3 }, { default: sqliteStoreFactory }] =
      await Promise.all([import("sqlite3"), import("express-session-sqlite")]);
    const SqliteStore = sqliteStoreFactory(session);
    return new SqliteStore({
      driver: sqlite3.Database,
      path: "./express_session_local.db",
      ttl: DEFAULT_TLL,
      prefix: DEFAULT_PREFIX,
      cleanupInterval: 300000,
    });
  }
};

const getSessionSecret = () => {
  const { SESSION_SECRET, NODE_ENV } = process.env;
  if (!SESSION_SECRET) {
    if (NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is required in production");
    }
    console.warn(
      "SESSION_SECRET not provided. Using an insecure default for development only.",
    );
    return "dev-only-insecure-session-secret";
  }
  return SESSION_SECRET;
};

// Will be used in app.use
export default async function customSession() {
  const secret = getSessionSecret();
  const store = await createStore();

  return session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store,
  });
}
