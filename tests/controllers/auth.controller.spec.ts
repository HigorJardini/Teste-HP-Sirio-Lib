import { Request, Response } from "express";
import { AuthController } from "../../src/controllers/auth.controller";
import { AuthService } from "../../src/services/auth.service";
import { authServiceMock } from "../mocks/auth.service.mock";
import { DataSource } from "typeorm";

const mockDataSource = {
  getRepository: jest.fn(),
};

jest.mock("../../src/services/auth.service", () => ({
  AuthService: jest.fn().mockImplementation(() => authServiceMock),
}));

describe("AuthController", () => {
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    const authService = new AuthService(
      mockDataSource as unknown as DataSource
    );
    authController = new AuthController(authService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  });

  it("should register a new user", async () => {
    const mockUser = { username: "john_doe", password: "SecurePassword123" };
    const newUser = { ...mockUser, id: 1 };

    authServiceMock.register.mockResolvedValue(newUser);

    req = { body: mockUser } as Partial<Request>;
    await authController.register(req as Request, res as Response);

    expect(authServiceMock.register).toHaveBeenCalledWith(
      mockUser.username,
      mockUser.password
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: { ...newUser, password: undefined },
    });
  });

  it("should handle registration error", async () => {
    authServiceMock.register.mockRejectedValue(
      new Error("Username already exists")
    );

    req = {
      body: { username: "john_doe", password: "SecurePassword123" },
    } as Partial<Request>;
    await authController.register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username already exists",
    });
  });

  it("should log in and generate a JWT token", async () => {
    const mockCredentials = {
      username: "john_doe",
      password: "SecurePassword123",
    };
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzIyNDc5MDUwLCJleHAiOjE3MjI0ODI2NTB9.wt1kaIhjOiHiuo4d7UMQK5etMYLtJZ4G71vrS2nUJwU";

    authServiceMock.login.mockResolvedValue(mockToken);

    req = { body: mockCredentials } as Partial<Request>;
    await authController.login(req as Request, res as Response);

    expect(authServiceMock.login).toHaveBeenCalledWith(
      mockCredentials.username,
      mockCredentials.password
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: mockToken });
  });

  it("should handle login error", async () => {
    authServiceMock.login.mockRejectedValue(new Error("Invalid credentials"));

    req = {
      body: { username: "john_doe", password: "WrongPassword" },
    } as Partial<Request>;
    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });
});
