import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { authenticateToken } from "../middleware/auth.middleware";
import AppDataSource from "../config/data-source";

const router = Router();
const userService = new UserService(AppDataSource);
const userController = new UserController(userService);

router.post(
  "/",
  authenticateToken,
  userController.createUser.bind(userController)
);
router.put(
  "/:id",
  authenticateToken,
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
