// Function to check password complexity meets requirements
exports.checkPassword = (password) => {
  const lowerCaseRegex = /^(?=.*[a-z])/;
  const upperCaseRegex = /^(?=.*[A-Z])/;
  const numberRegex = /^(?=.*[0-9])/;
  const lengthRegex = /^(?=.{9,})/;

  if (!lengthRegex.test(password)) {
    return {
      success: false,
      message: "Password must be at least 9 characters long",
    };
  }
  if (!lowerCaseRegex.test(password)) {
    return {
      success: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!upperCaseRegex.test(password)) {
    return {
      success: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!numberRegex.test(password)) {
    return {
      success: false,
      message: "Password must contain at least one number",
    };
  }

  return {
    success: true,
    message: "Password is valid",
  };
};
