import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateUserData } from "../middleware/validation.middlewares";
import AppDataSource from "../configs/data-source";

const router = Router();
const userService = new UserService(AppDataSource);
const userController = new UserController(userService);

router.post(
  "/",
  authenticateToken,
  validateUserData,
  userController.createUser.bind(userController)
);

router.put(
  "/:id",
  authenticateToken,
  validateUserData,
  userController.updateUser.bind(userController)
);

router.delete(
  "/:id",
  authenticateToken,
  userController.deleteUser.bind(userController)
);

router.get(
  "/:id",
  authenticateToken,
  userController.getUserById.bind(userController)
);

router.get(
  "/",
  authenticateToken,
  userController.getAllUsers.bind(userController)
);

export default router;
