let express = require("express");
let router = express.Router();
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
  res.render("index", { title: "Express" });
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
  (req, res, next) => {
    auth.passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err); // Handle server errors
      }
      if (!user) {
        // If authentication fails, render the homepage with the error message
        return res.render("/", { errors: [{ msg: info.message }] });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/"); // Redirect to the homepage on successful login
      });
    })(req, res, next);
  }
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
