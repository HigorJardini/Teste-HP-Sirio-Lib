import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerUserSchema, loginUserSchema } from "../dtos/auth.dto";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operations related to user authentication and registration
 */
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *               password:
   *                 type: string
   *                 example: SecurePassword123
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User registered successfully
   *                 user:
   *                   type: object
   *                   properties:
   *                     username:
   *                       type: string
   *                       example: john_doe
   *       400:
   *         description: Username and password are required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Username and password are required
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      // Validate request body
      const { error } = registerUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { username, password } = req.body;

      // Register the new user
      const newUser = await this.authService.register(username, password);

      const { ["password"]: unused, ...formatUser } = newUser;

      return res
        .status(201)
        .json({ message: "User registered successfully", user: formatUser });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Username already exists") {
          return res.status(404).json({ message: error.message });
        }

        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Log in and generate a JWT token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *               password:
   *                 type: string
   *                 example: SecurePassword123
   *     responses:
   *       200:
   *         description: Login successful and JWT token generated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzIyNDc5MDUwLCJleHAiOjE3MjI0ODI2NTB9.wt1kaIhjOiHiuo4d7UMQK5etMYLtJZ4G71vrS2nUJwU
   *       400:
   *         description: Username and password are required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Username and password are required
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid credentials
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      // Validate request body
      const { error } = loginUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { username, password } = req.body;

      // Perform login and generate a JWT token
      const token = await this.authService.login(username, password);

      if (!token) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          return res.status(404).json({ message: error.message });
        } else if (error.message === "Invalid credentials") {
          return res.status(401).json({ message: error.message });
        }

        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
