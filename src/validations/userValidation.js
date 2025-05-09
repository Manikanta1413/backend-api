// exports.registerSchema = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
//   phoneNumber: Joi.string().min(10).max(15).required(),
//   address: Joi.string()?.required(),
// });

// validations/registerValidation.js
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "Phone number must contain only digits",
    }),
  address: Joi.string().allow(""), // optional
});

module.exports = registerSchema;
