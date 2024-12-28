import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { AuthStore } from "./auth_types";
type Config = {
  jwt_secret: string;
  store: AuthStore;
};
export const configurePassport = (config: Config) => {
  passport.use(
    new LocalStrategy(async (username, password, callback) => {
      // The verification function will only be called when the user signs in, after 
      // which Passport uses a temporary token to authenticate subsequent requests.
      if (await config.store.validateCredentials(username, password)) {
        return callback(null, { username });
      }
      return callback(null, false);
    })
  );
  passport.use(
    new JwtStrategy(
      {
        // Passport doesn’t generate JWT tokens, and the verification function is called 
        // when a bearer token is received.
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt_secret,
      },
      (payload, callback) => {
        return callback(null, { username: payload.username });
      }
    )
  );

  // The serializeUser and deserializeUser functions are used by Passport to include user 
  // information in the session.
  passport.serializeUser((user, callback) => {
    callback(null, user);
  });
  passport.deserializeUser((user, callback) => {
    callback(null, user as Express.User);
  });
};
