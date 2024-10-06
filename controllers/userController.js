const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { matchedData, validationResult } = require("express-validator");

// Create a new user
const handleUserSignUp = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("sign-up-form", { errors: errors.array() });
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
    return res.render("/", { errors: errors.array() });
  }

  next();
});

module.exports = {
  handleUserSignUp,
  handleUserLogIn,
};
