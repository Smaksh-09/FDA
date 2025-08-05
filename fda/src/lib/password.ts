import bcrypt from 'bcrypt';

const saltRounds = 10; // The cost factor for hashing

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, saltRounds);
  };

  export const comparePasswords = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  };