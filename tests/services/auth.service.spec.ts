import { DataSource, Repository } from "typeorm";
import { AuthService } from "../../src/services/auth.service";
import { UserLogins } from "../../src/entities/userLogins.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

type MockedUserLoginRepository = {
  findOneBy: jest.Mock<Promise<UserLogins | null>, [Partial<UserLogins>]>;
  create: jest.Mock<UserLogins, [Partial<UserLogins>]>;
  save: jest.Mock<Promise<UserLogins>, [UserLogins]>;
};

type MockedDataSource = {
  getRepository: jest.Mock<Repository<UserLogins>, [typeof UserLogins]>;
};

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("AuthService", () => {
  let authService: AuthService;
  let userLoginRepo: MockedUserLoginRepository;
  let mockDataSource: MockedDataSource;

  beforeEach(() => {
    mockDataSource = {
      getRepository: jest.fn(),
    } as unknown as MockedDataSource;

    userLoginRepo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as MockedUserLoginRepository;

    mockDataSource.getRepository.mockReturnValue(
      userLoginRepo as unknown as Repository<UserLogins>
    );

    authService = new AuthService(mockDataSource as unknown as DataSource);

    mockedBcrypt.hash.mockImplementation(async () => "hashedPassword");
    mockedBcrypt.compare.mockImplementation(
      async (password: string, hash: string) => password === "password123"
    );
    mockedJwt.sign.mockImplementation((payload, secret, options) => {
      return "jwtToken";
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const username = "testuser";
      const password = "password123";

      userLoginRepo.findOneBy.mockResolvedValue(null);
      userLoginRepo.create.mockReturnValue({
        username,
        password: "hashedPassword",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as UserLogins);
      userLoginRepo.save.mockResolvedValue({
        username,
        password: "hashedPassword",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as UserLogins);

      const result = await authService.register(username, password);

      expect(userLoginRepo.findOneBy).toHaveBeenCalledWith({ username });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userLoginRepo.create).toHaveBeenCalledWith({
        username,
        password: "hashedPassword",
        status: true,
      });
      expect(userLoginRepo.save).toHaveBeenCalledWith({
        username,
        password: "hashedPassword",
        status: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(result).toEqual({
        username,
        password: "hashedPassword",
        status: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it("should throw an error if the user already exists", async () => {
      const username = "testuser";
      const password = "password123";

      userLoginRepo.findOneBy.mockResolvedValue({
        username,
        password: "hashedPassword",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as UserLogins);

      await expect(authService.register(username, password)).rejects.toThrow(
        "Username already exists"
      );
    });
  });

  describe("login", () => {
    it("should throw an error if the user is not found", async () => {
      const username = "testuser";
      const password = "password123";

      userLoginRepo.findOneBy.mockResolvedValue(null);

      await expect(authService.login(username, password)).rejects.toThrow(
        "User not found"
      );
    });
  });
});
