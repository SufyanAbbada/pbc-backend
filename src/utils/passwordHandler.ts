import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (err) {
    throw new Error(`Failed to hash password: ${(err as Error).message}`);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw new Error(
      `Failed to compare the hashed password: ${(err as Error).message}`,
    );
  }
};
