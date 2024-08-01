import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import userSchema from "../dtos/user.dto";

export function validateRegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.min": "Username should have a minimum length of 3 characters",
      "string.max": "Username should have a maximum length of 50 characters",
      "any.required": "Username is required",
    }),
    password: Joi.string().min(6).max(100).required().messages({
      "string.min": "Password should have a minimum length of 6 characters",
      "string.max": "Password should have a maximum length of 100 characters",
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    console.error(
      "Validation error:",
      error.details.map((detail) => detail.message).join(", ")
    );
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
}

export function validateLoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.min": "Username should have a minimum length of 3 characters",
      "string.max": "Username should have a maximum length of 50 characters",
      "any.required": "Username is required",
    }),
    password: Joi.string().min(6).max(100).required().messages({
      "string.min": "Password should have a minimum length of 6 characters",
      "string.max": "Password should have a maximum length of 100 characters",
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    console.error(
      "Validation error:",
      error.details.map((detail) => detail.message).join(", ")
    );
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
}

export function validateUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.error(
      "Validation error:",
      error.details.map((detail) => detail.message).join(", ")
    );
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
}
