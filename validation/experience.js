const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function validateExperienceInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "new Job Title field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Job Company field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "Job date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
