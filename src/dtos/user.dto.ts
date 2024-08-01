// src/dto/user.dto.ts
import Joi from "joi";
import { isValidCPF } from "../utils/cpf.utils";

// Regex para códigos postais
const brazilianPostalCodeRegex = /^\d{5}-\d{3}$/;
const usPostalCodeRegex = /^\d{5}(?:-\d{4})?$/;

// Schema para validação de usuário
const userSchema = Joi.object({
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .custom((value, helpers) => {
      if (!isValidCPF(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "CPF Validation")
    .required()
    .messages({
      "string.pattern.base":
        "Invalid CPF format. It must be 11 digits without any punctuation.",
      "any.invalid": "Invalid CPF number",
      "any.required": "CPF is required",
    }),
  name: Joi.string().min(3).max(100).required().messages({
    "string.min": "Name should have a minimum length of 3 characters",
    "string.max": "Name should have a maximum length of 100 characters",
    "any.required": "Name is required",
  }),
  birth_date: Joi.string().isoDate().required().messages({
    "string.isoDate": "Birth date must be a valid ISO date",
    "any.required": "Birth date is required",
  }),
  address: Joi.object({
    street: Joi.string().required(),
    house_number: Joi.string().required(),
    complement: Joi.string().allow("").optional(),
    neighborhood: Joi.string().required(),
    city: Joi.object({
      city_name: Joi.string().required(),
      state: Joi.object({
        state_name: Joi.string().required(),
        iso_code: Joi.string().length(2).required(),
        country: Joi.object({
          country_name: Joi.string().required(),
          iso_code: Joi.string().length(2).required(),
        }).required(),
      }).required(),
    }).required(),
    postal_code: Joi.string().when("city.state.country.iso_code", {
      is: "BR",
      then: Joi.string().pattern(brazilianPostalCodeRegex).required().messages({
        "string.pattern.base":
          "Invalid postal code format for Brazil. Example: 12345-678",
        "any.required": "Postal code is required",
      }),
      otherwise: Joi.string().when("city.state.country.iso_code", {
        is: "US",
        then: Joi.string().pattern(usPostalCodeRegex).required().messages({
          "string.pattern.base":
            "Invalid postal code format for the United States. Example: 12345 or 12345-6789",
          "any.required": "Postal code is required",
        }),
        otherwise: Joi.string().required().messages({
          "any.required": "Postal code is required",
        }),
      }),
    }),
  }).required(),
  is_active: Joi.boolean().default(true),
});

export default userSchema;
