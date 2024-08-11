import bcrypt from "bcrypt";

export class CryptoPassword {
  private constructor() {}

  static async encrypt(password: string): Promise<string> {
    const saltRounds = 10;
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return  hash;
    } catch (error) {
      throw new Error("Erro ao criptografar a senha");
    }
  }

  static async decrypt(password: string, databasePassword: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, databasePassword);
      return result;
    } catch (error) {
      throw new Error("Erro ao comparar as senhas");
    }
  }
}
