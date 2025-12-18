import { verify } from 'jsonwebtoken';

export const verifyTokenAuth = (token: string) => {
  return verify(token, process.env.JWT_SECRET!);
};
