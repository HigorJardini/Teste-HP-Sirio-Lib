import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import AppDataSource from "../configs/data-source";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../middleware/validation.middlewares";

const router = Router();
const authService = new AuthService(AppDataSource);
const authController = new AuthController(authService);

router.post(
  "/register",
  validateRegisterUser,
  authController.register.bind(authController)
);
router.post(
  "/login",
  validateLoginUser,
  authController.login.bind(authController)
);

export default router;
