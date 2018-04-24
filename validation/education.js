const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function validateEducationInput(data) {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "new Job school field is required";
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Job degree field is required";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Job Field of Study field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "Job date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
