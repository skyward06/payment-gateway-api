import { verify } from 'jsonwebtoken';

import { ENV } from '@/consts';

export const verifyTokenAuth = (token: string) => {
  return verify(token, ENV.JWT_SECRET);
};
