import * as argon2 from "argon2";

export class HashService {
  public static hashPassword = async (password: string): Promise<string> =>
    await argon2.hash(password, { type: argon2.argon2d });

  public static verifyPassword = async (
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> => await argon2.verify(hashedPassword, plainPassword);
}
