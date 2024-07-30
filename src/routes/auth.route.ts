import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import AppDataSource from "../config/data-source";

const router = Router();
const authService = new AuthService(AppDataSource);
const authController = new AuthController(authService);

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

export default router;
