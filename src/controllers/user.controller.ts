import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { JwtPayload } from "jsonwebtoken";
import userSchema from "../dtos/user.dto";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cpf:
   *                 type: string
   *               name:
   *                 type: string
   *               birth_date:
   *                 type: string
   *                 format: date
   *               address:
   *                 type: object
   *                 properties:
   *                   street:
   *                     type: string
   *                   house_number:
   *                     type: string
   *                   complement:
   *                     type: string
   *                     nullable: true
   *                   neighborhood:
   *                     type: string
   *                   city:
   *                     type: object
   *                     properties:
   *                       city_name:
   *                         type: string
   *                       state:
   *                         type: object
   *                         properties:
   *                           state_name:
   *                             type: string
   *                           iso_code:
   *                             type: string
   *                           country:
   *                             type: object
   *                             properties:
   *                               country_name:
   *                                 type: string
   *                               iso_code:
   *                                 type: string
   *                   postal_code:
   *                     type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user_id:
   *                   type: integer
   *                 cpf:
   *                   type: string
   *                 name:
   *                   type: string
   *                 birth_date:
   *                   type: string
   *                   format: date
   *                 address:
   *                   type: object
   *                   properties:
   *                     address_id:
   *                       type: integer
   *                     street:
   *                       type: string
   *                     house_number:
   *                       type: string
   *                     complement:
   *                       type: string
   *                       nullable: true
   *                     neighborhood:
   *                       type: string
   *                     city:
   *                       type: object
   *                       properties:
   *                         city_name:
   *                           type: string
   *                         state:
   *                           type: object
   *                           properties:
   *                             state_name:
   *                               type: string
   *                             iso_code:
   *                               type: string
   *                             country:
   *                               type: object
   *                               properties:
   *                                 country_name:
   *                                   type: string
   *                                 iso_code:
   *                                   type: string
   *                     postal_code:
   *                       type: string
   *                 is_active:
   *                   type: boolean
   *       400:
   *         description: Bad request, invalid input or validation error
   *         content:
   *           application/json:
   *             examples:
   *               cpfDuplicated:
   *                 value: { error: "User with this CPF already exists" }
   *               cpfInvalid:
   *                 value: { error: "CPF must be a valid CPF number" }
   *               nameRequired:
   *                 value: { error: "Name is required" }
   *               birthDateInvalid:
   *                 value: { error: "Birth date must be a valid date" }
   *               postalCodeInvalid:
   *                 value: { error: "Postal code must be in the format 12345-678" }
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;
      const loginUserId = (req.user as JwtPayload)?.id;

      if (!loginUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newUser = await this.userService.createUser(userData, loginUserId);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User with this CPF already exists") {
          return res.status(400).json({ message: error.message });
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
   * /users/{id}:
   *   put:
   *     summary: Update an existing user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to be updated
   *         schema:
   *           type: integer
   *           format: int64
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cpf:
   *                 type: string
   *               name:
   *                 type: string
   *               birth_date:
   *                 type: string
   *                 format: date
   *               address:
   *                 type: object
   *                 properties:
   *                   street:
   *                     type: string
   *                   house_number:
   *                     type: string
   *                   complement:
   *                     type: string
   *                     nullable: true
   *                   neighborhood:
   *                     type: string
   *                   city:
   *                     type: object
   *                     properties:
   *                       city_name:
   *                         type: string
   *                       state:
   *                         type: object
   *                         properties:
   *                           state_name:
   *                             type: string
   *                           iso_code:
   *                             type: string
   *                           country:
   *                             type: object
   *                             properties:
   *                               country_name:
   *                                 type: string
   *                               iso_code:
   *                                 type: string
   *                   postal_code:
   *                     type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user_id:
   *                   type: integer
   *                 cpf:
   *                   type: string
   *                 name:
   *                   type: string
   *                 birth_date:
   *                   type: string
   *                   format: date
   *                 address:
   *                   type: object
   *                   properties:
   *                     address_id:
   *                       type: integer
   *                     street:
   *                       type: string
   *                     house_number:
   *                       type: string
   *                     complement:
   *                       type: string
   *                       nullable: true
   *                     neighborhood:
   *                       type: string
   *                     city:
   *                       type: object
   *                       properties:
   *                         city_name:
   *                           type: string
   *                         state:
   *                           type: object
   *                           properties:
   *                             state_name:
   *                               type: string
   *                             iso_code:
   *                               type: string
   *                             country:
   *                               type: object
   *                               properties:
   *                                 country_name:
   *                                   type: string
   *                                 iso_code:
   *                                   type: string
   *                     postal_code:
   *                       type: string
   *                 is_active:
   *                   type: boolean
   *       400:
   *         description: Bad request, invalid input or validation error
   *         content:
   *           application/json:
   *             examples:
   *               cpfInvalid:
   *                 value: { error: "CPF must be a valid CPF number" }
   *               nameRequired:
   *                 value: { error: "Name is required" }
   *               birthDateInvalid:
   *                 value: { error: "Birth date must be a valid date" }
   *               postalCodeInvalid:
   *                 value: { error: "Postal code must be in the format 12345-678" }
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = BigInt(req.params.id);
      const userData = req.body;
      const loginUserId = (req.user as JwtPayload)?.id;

      if (!loginUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedUser = await this.userService.updateUser(
        userId,
        userData,
        loginUserId
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User with this CPF already exists") {
          return res.status(400).json({ message: error.message });
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
   * /users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to delete
   *         schema:
   *           type: integer
   *           format: int64
   *     responses:
   *       204:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  public async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = BigInt(req.params.id);
      const loginUserId = (req.user as JwtPayload)?.id;

      if (!loginUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await this.userService.deleteUser(userId, loginUserId);

      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to fetch
   *         schema:
   *           type: integer
   *           format: int64
   *     responses:
   *       200:
   *         description: User fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user_id:
   *                   type: integer
   *                 cpf:
   *                   type: string
   *                 name:
   *                   type: string
   *                 birth_date:
   *                   type: string
   *                   format: date
   *                 address:
   *                   type: object
   *                   properties:
   *                     address_id:
   *                       type: integer
   *                     street:
   *                       type: string
   *                     house_number:
   *                       type: string
   *                     complement:
   *                       type: string
   *                       nullable: true
   *                     neighborhood:
   *                       type: string
   *                     city:
   *                       type: object
   *                       properties:
   *                         city_name:
   *                           type: string
   *                         state:
   *                           type: object
   *                           properties:
   *                             state_name:
   *                               type: string
   *                             iso_code:
   *                               type: string
   *                             country:
   *                               type: object
   *                               properties:
   *                                 country_name:
   *                                   type: string
   *                                 iso_code:
   *                                   type: string
   *                     postal_code:
   *                       type: string
   *                 is_active:
   *                   type: boolean
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = BigInt(req.params.id);
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   user_id:
   *                     type: integer
   *                   cpf:
   *                     type: string
   *                   name:
   *                     type: string
   *                   birth_date:
   *                     type: string
   *                     format: date
   *                   address:
   *                     type: object
   *                     properties:
   *                       address_id:
   *                         type: integer
   *                       street:
   *                         type: string
   *                       house_number:
   *                         type: string
   *                       complement:
   *                         type: string
   *                         nullable: true
   *                       neighborhood:
   *                         type: string
   *                       city:
   *                         type: object
   *                         properties:
   *                           city_name:
   *                             type: string
   *                           state:
   *                             type: object
   *                             properties:
   *                               state_name:
   *                                 type: string
   *                               iso_code:
   *                                 type: string
   *                               country:
   *                                 type: object
   *                                 properties:
   *                                   country_name:
   *                                     type: string
   *                                   iso_code:
   *                                     type: string
   *                       postal_code:
   *                         type: string
   *                   is_active:
   *                     type: boolean
   *       500:
   *         description: Internal server error
   */
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
