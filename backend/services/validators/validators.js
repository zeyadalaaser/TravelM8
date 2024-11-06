// Regex patterns
const usernamePattern = /^[a-zA-Z0-9]{3,16}$/; //username to include letters, numbers. length 3->16
const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{4,}$/; //contains letters and numbers and doesnt allow whitespaces with min length 4

// Validation functions
const validateUsername = (value) => usernamePattern.test(value);
const validatePassword = (value) => passwordPattern.test(value);

// Export validations
export {
  usernamePattern,
  passwordPattern,
  validateUsername,
  validatePassword,
};
