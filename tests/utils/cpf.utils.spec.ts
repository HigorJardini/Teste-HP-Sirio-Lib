import { isValidCPF } from "../../src/utils/cpf.utils";

describe("isValidCPF", () => {
  it("should return true for a valid CPF", () => {
    const validCPFs = [
      "12345678909", // valid CPF
      "11144477735", // valid CPF
    ];

    validCPFs.forEach((cpf) => {
      expect(isValidCPF(cpf)).toBe(true);
    });
  });

  it("should return false for an invalid CPF", () => {
    const invalidCPFs = [
      "12345678900", // invalid CPF
      "00000000000", // CPF with all digits the same
      "11111111111", // invalid CPF
      "12345678901", // invalid CPF
      "123456789", // incomplete
    ];

    invalidCPFs.forEach((cpf) => {
      expect(isValidCPF(cpf)).toBe(false);
    });
  });
});
