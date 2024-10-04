const LocalStrategy = require("passport-local").Strategy;
const userService = require("../functions/users.service");

async function initialize(passport, email, id) {
  const authenticateUser = async (email, password, done) => {
    const user = await userService.getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (password = user.password) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, userService.getUserById(id));
  });
}

module.exports = initialize;