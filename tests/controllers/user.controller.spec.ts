import request from "supertest";
import express from "express";
import { UserController } from "../../src/controllers/user.controller";
import { UserService } from "../../src/services/user.service";

const app = express();
app.use(express.json());

const userService = {
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
};

const userController = new UserController(
  userService as unknown as UserService
);

app.post("/users", (req, res) => userController.createUser(req, res));
app.put("/users/:id", (req, res) => userController.updateUser(req, res));
app.delete("/users/:id", (req, res) => userController.deleteUser(req, res));
app.get("/users/:id", (req, res) => userController.getUserById(req, res));
app.get("/users", (req, res) => userController.getAllUsers(req, res));

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get a user by ID", async () => {
    const user = {
      user_id: 1,
      cpf: "12345678900",
      name: "John Doe",
      birth_date: "2000-01-01",
      address: {},
      is_active: true,
    };
    (userService.getUserById as jest.Mock).mockResolvedValue(user);

    const response = await request(app).get("/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  it("should get all users", async () => {
    const users = [
      {
        user_id: 1,
        cpf: "12345678900",
        name: "John Doe",
        birth_date: "2000-01-01",
        address: {},
        is_active: true,
      },
    ];
    (userService.getAllUsers as jest.Mock).mockResolvedValue(users);

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });
});
