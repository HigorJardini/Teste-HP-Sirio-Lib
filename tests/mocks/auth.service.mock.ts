import { AuthService } from "../../src/services/auth.service";

export const authServiceMock = {
  register: jest.fn(),
  login: jest.fn(),
};

export default AuthService;
