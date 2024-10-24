let express = require("express");
let router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let userController = require("../controllers/userController");

const { checkSchema } = require("express-validator");

const createUserValidationSchema = require("./utils/userValidationSchemas");
const userLoginValidationSchema = require("./utils/userLoginValidationSchemas");
const auth = require("./auth");

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

router.post(
  "/sign-up",
  checkSchema(createUserValidationSchema),
  userController.handleUserSignUp,
  auth.passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.post(
  "/log-in",
  checkSchema(userLoginValidationSchema),
  userController.handleUserLogIn,
  userController.handleUserAuthentication
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Sample route to render the profile page
router.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.user.id),
      },
      include: {
        files: true,
      },
    });
    res.render("profile", { user });
  } else {
    res.redirect("/log-in");
  }
});

module.exports = router;
