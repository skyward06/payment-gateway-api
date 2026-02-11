import 'dotenv/config';

import { PaymentNetwork } from '@/generated/prisma/client';
import path from 'path';

export const ENV = {
  NODE_ENV: process.env.NODE_ENV?.toLowerCase() ?? 'development',

  APP_PORT: process.env.APP_PORT || 4000,
  APP_HOST: process.env.APP_HOST || '127.0.0.1',

  DATABASE_URL: process.env.DATABASE_URL!,

  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,

  MEMPOOL: {
    API: process.env.MEMPOOL_API ?? 'https://mempool.texitcoin.org/api',
  },

  TEMP_FILE_DIR: process.env.TEMP_FILE_DIR ?? path.join(process.cwd(), 'temp_files'),
};

// Per-chain payment configuration
export const CHAIN_CONFIG: Record<
  PaymentNetwork,
  {
    expirationMinutes: number;
    confirmationsRequired: number;
  }
> = {
  [PaymentNetwork.TXC]: {
    expirationMinutes: 60,
    confirmationsRequired: 6,
  },
  [PaymentNetwork.ETH]: {
    expirationMinutes: 30,
    confirmationsRequired: 12,
  },
  [PaymentNetwork.BASE]: {
    expirationMinutes: 30,
    confirmationsRequired: 12,
  },
  [PaymentNetwork.BSC]: {
    expirationMinutes: 30,
    confirmationsRequired: 15,
  },
  [PaymentNetwork.POLYGON]: {
    expirationMinutes: 30,
    confirmationsRequired: 128,
  },
};

export const CONFIG = {};

export const TXC_EXPLORER = 'https://explorer.texitcoin.org';
