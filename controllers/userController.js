const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { matchedData, validationResult } = require("express-validator");
const auth = require("../routes/auth");

// Create a new user
const handleUserSignUp = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("index/sign-up", { errors: errors.array() });
  }

  const data = matchedData(req);
  console.log(data);

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
    });
  } catch (err) {
    return next(err);
  }
  next();
});

const handleUserLogIn = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("index/log-in", { errors: errors.array() });
  }

  next();
});

const handleUserAuthentication = asyncHandler(async (req, res, next) => {
  auth.passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle server errors
    }
    if (!user) {
      // If authentication fails, render the homepage with the error message
      return res.render("index/log-in", { errors: [{ msg: info.message }] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/"); // Redirect to the homepage on successful login
    });
  })(req, res, next);
});

module.exports = {
  handleUserSignUp,
  handleUserLogIn,
  handleUserAuthentication,
};
