import { DataSource } from "typeorm";
import { UserLogins } from "../entities/userLogins.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private dataSource: DataSource;
  private saltRounds: number = 10;
  private secretKey: string = process.env.JWT_SECRET || "secret_key";

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async register(username: string, password: string): Promise<UserLogins> {
    const loginUserRepo = this.dataSource.getRepository(UserLogins);

    // Check if the user already exists
    const existingUser = await loginUserRepo.findOneBy({ username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create new user
    const newUser = loginUserRepo.create({
      username,
      password: hashedPassword,
      status: true,
    });

    return loginUserRepo.save(newUser);
  }

  async login(username: string, password: string): Promise<string> {
    const loginUserRepo = this.dataSource.getRepository(UserLogins);

    const user = await loginUserRepo.findOneBy({ username });
    if (!user) {
      throw new Error("Invalid credentials");
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
