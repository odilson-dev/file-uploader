const createUserLogInValidationSchema = {
  username: {
    notEmpty: { errorMessage: "The username must not be empty" },
  },
  password: {
    trim: { options: [" "] },
    notEmpty: { errorMessage: "The password must not be empty" },
    isLength: {
      options: { min: 8, max: 12 },
      errorMessage: "The password must be between 8 and 12 characters",
    },
  },
};

module.exports = createUserLogInValidationSchema;
