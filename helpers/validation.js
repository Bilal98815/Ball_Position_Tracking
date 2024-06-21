exports.authenticationValidation = [
  check("email", "Please enter valid Email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];
