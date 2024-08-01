// src/services/auth.service.ts
import { DataSource } from "typeorm";
import { UserLogins } from "../entities/userLogins.entity";
import { UserLoginRepository } from "../repositories/user-login.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private userLoginRepo: UserLoginRepository;
  private saltRounds: number = 10;
  private secretKey: string = process.env.JWT_SECRET || "secret_key";

  constructor(dataSource: DataSource) {
    this.userLoginRepo = new UserLoginRepository(dataSource);
  }

  async register(username: string, password: string): Promise<UserLogins> {
    // Check if the user already exists
    const existingUser = await this.userLoginRepo.findOneByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create new user
    const newUser = this.userLoginRepo.create({
      username,
      password: hashedPassword,
      status: true,
    });

    return this.userLoginRepo.save(newUser);
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userLoginRepo.findOneByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Create token JWT
    const payload = { id: user.login_id, username: user.username };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: "1h" });
    return token;
  }
}
