import passport from "passport";
import { Strategy } from "passport-local";
import User from "../mongoose/shcemas/user.mjs";
import { comparePasswords } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username }).select("+password");

      if (!findUser) throw new Error("User not found");

      const comparedPass = await comparePasswords(password, findUser.password);
      if (!comparedPass) throw new Error("Invalid credentials");
      findUser.password = undefined;
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
