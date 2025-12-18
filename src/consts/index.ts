import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { PaymentNetwork } from '@prisma/client';

export const ENV = {
  NODE_ENV: process.env.NODE_ENV?.toLowerCase() ?? 'development',

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
