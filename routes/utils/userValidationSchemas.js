const createUserValidationSchema = {
  username: {
    trim: { options: [" "] },
    notEmpty: { errorMessage: "Name must not be empty" },
    isAlpha: { errorMessage: "Name must be alphabet" },
  },

  password: {
    trim: { options: [" "] },
    notEmpty: { errorMessage: "The password must not be empty" },
    isLength: {
      options: { min: 8, max: 12 },
      errorMessage: "The password must be between 8 and 12 characters",
    },
  },
  confirmPassword: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(
            "The confirm Password doesn't match the password field"
          );
        }
        return true;
      },
    },
  },
};

module.exports = createUserValidationSchema;
