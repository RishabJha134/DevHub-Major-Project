const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("please enter valid Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("please enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }
};

const validateEditProfileData = (req) => {
  const validatedInput = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((keys) =>
    validatedInput.includes(keys)
  );
  console.log(isEditAllowed);
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
