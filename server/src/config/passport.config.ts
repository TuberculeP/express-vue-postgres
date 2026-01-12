import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pg from "./db.config";
import bcrypt from "bcrypt";
import { User } from "./entities/User";
import _ from "lodash";

export const isGoogleAuthEnabled = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
};

export default function initializePassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async function verify(email, password, cb) {
        // Validate user
        if (!email || !password) {
          cb(null, false, { message: "All fields are required" });
          return;
        }

        const userRepository = pg.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email } });
        if (!existingUser) {
          cb(null, false, { message: "User not found" });
          return;
        }

        const isPasswordValid = bcrypt.compareSync(
          password,
          existingUser.password ?? "",
        );

        if (!isPasswordValid) {
          cb(null, false, { message: "Invalid credentials" });
          return;
        }

        cb(null, existingUser);
      },
    ),
  );

  // Google OAuth Strategy
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
    process.env;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const userRepository = pg.getRepository(User);

            // Chercher un utilisateur existant par googleId
            let user = await userRepository.findOne({
              where: { googleId: profile.id },
            });

            if (!user) {
              // Chercher par email (peut-être déjà inscrit classiquement)
              const email = profile.emails?.[0]?.value;
              if (email) {
                user = await userRepository.findOne({ where: { email } });
                if (user) {
                  // Lier le compte Google au compte existant
                  user.googleId = profile.id;
                  await userRepository.save(user);
                }
              }
            }

            if (!user) {
              // Créer un nouveau compte
              user = new User();
              user.googleId = profile.id;
              user.email = profile.emails?.[0]?.value ?? "";
              user.firstName =
                profile.name?.givenName ||
                profile.displayName?.split(" ")[0] ||
                "User";
              user.lastName =
                profile.name?.familyName ||
                profile.displayName?.split(" ").slice(1).join(" ") ||
                "";
              user = await userRepository.save(user);
            }

            done(null, user);
          } catch (err) {
            done(err as Error, undefined);
          }
        },
      ),
    );
  } else {
    console.warn(
      "Google OAuth credentials not provided. Google login disabled.",
    );
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await pg.getRepository(User).findOne({ where: { id } });
      if (!user) {
        return done(new Error("User not found"), false);
      }
      done(null, _.omit(user, "password"));
    } catch (err) {
      done(err, false);
    }
  });
}
