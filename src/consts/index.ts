export * from './const';

// ==================== AUTH ====================
export const STORAGE_TOKEN_KEY = 'token';
export const STORAGE_ROLE_KEY = 'userRole';

/**
 * SMALLEST UNIT CONVENTION
 *
 * All monetary amounts in this application use SMALLEST UNITS:
 * - USD: cents (1 dollar = 100 cents, decimals: 2)
 * - TXC: cros (1 TXC = 100,000,000 cros, decimals: 8)
 * - ETH: wei (1 ETH = 10^18 wei, decimals: 18)
 * - USDC/USDT: micro (1 USDC = 1,000,000 micro, decimals: 6)
 *
 * Exchange rates are in BIG UNITS (e.g., 2.88 USD per 1 TXC)
 */

// ==================== PAYMENT STATUS ====================
export const PAYMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'warning', icon: 'mdi:clock-outline' },
  DETECTING: { label: 'Detecting', color: 'info', icon: 'mdi:magnify' },
  CONFIRMING: { label: 'Confirming', color: 'info', icon: 'mdi:timer-sand' },
  COMPLETED: { label: 'Completed', color: 'success', icon: 'mdi:check-circle' },
  EXPIRED: { label: 'Expired', color: 'error', icon: 'mdi:clock-alert' },
  FAILED: { label: 'Failed', color: 'error', icon: 'mdi:close-circle' },
  CANCELLED: { label: 'Cancelled', color: 'default', icon: 'mdi:cancel' },
  UNDERPAID: { label: 'Underpaid', color: 'warning', icon: 'mdi:currency-usd-off' },
  OVERPAID: { label: 'Overpaid', color: 'success', icon: 'mdi:currency-usd' },
} as const;

export type PaymentStatusType = keyof typeof PAYMENT_STATUS;

// ==================== SUPPORTED NETWORKS ====================
export const NETWORKS = {
  TXC: { label: 'Texitcoin', icon: '/images/crypto/txc.png' },
  ETH: { label: 'Ethereum', icon: '/images/crypto/eth.png' },
  BASE: { label: 'Base', icon: '/images/crypto/base.png' },
  BSC: { label: 'BNB Chain', icon: '/images/crypto/bsc.png' },
  POLYGON: { label: 'Polygon', icon: '/images/crypto/polygon.png' },
} as const;

export type NetworkType = keyof typeof NETWORKS;

// ==================== SUPPORTED CURRENCIES ====================
/**
 * Currency configuration with decimal places for smallest unit conversion.
 * decimals = number of decimal places (10^decimals smallest units = 1 big unit)
 */
export const CURRENCIES = {
  // Fiat currencies
  USD: { label: 'USD', decimals: 2, network: null, smallestUnit: 'cent' },
  // Crypto currencies
  TXC: { label: 'TXC', decimals: 8, network: 'TXC', smallestUnit: 'cro' },
  ETH: { label: 'ETH', decimals: 18, network: 'ETH', smallestUnit: 'wei' },
  USDC: { label: 'USDC', decimals: 6, network: 'ETH', smallestUnit: 'micro' },
  USDT: { label: 'USDT', decimals: 6, network: 'ETH', smallestUnit: 'micro' },
  BTC: { label: 'BTC', decimals: 8, network: 'BTC', smallestUnit: 'satoshi' },
} as const;

export type CurrencyType = keyof typeof CURRENCIES;

// ==================== API KEY PERMISSIONS ====================
export const API_KEY_PERMISSIONS = [
  { value: 'payments.create', label: 'Create Payments' },
  { value: 'payments.read', label: 'Read Payments' },
  { value: 'payments.cancel', label: 'Cancel Payments' },
  { value: 'webhooks.manage', label: 'Manage Webhooks' },
] as const;

// ==================== WEBHOOK STATUS ====================
export const WEBHOOK_STATUS = {
  PENDING: { label: 'Pending', color: 'warning' },
  SUCCESS: { label: 'Success', color: 'success' },
  FAILED: { label: 'Failed', color: 'error' },
} as const;

// ==================== EXTERNAL LINKS ====================
export const MEMPOOL_URL = 'https://mempool.texitcoin.org';
export const ETHERSCAN_URL = 'https://etherscan.io';
export const BASESCAN_URL = 'https://basescan.org';
export const BSCSCAN_URL = 'https://bscscan.com';
export const POLYGONSCAN_URL = 'https://polygonscan.com';

// Helper to get explorer URL for a network
export const getExplorerUrl = (network: string): string => {
  switch (network) {
    case 'TXC':
      return MEMPOOL_URL;
    case 'ETH':
      return ETHERSCAN_URL;
    case 'BASE':
      return BASESCAN_URL;
    case 'BSC':
      return BSCSCAN_URL;
    case 'POLYGON':
      return POLYGONSCAN_URL;
    default:
      return MEMPOOL_URL;
  }
};

// Helper to get transaction URL
export const getTxUrl = (network: string, txHash: string): string => {
  const explorer = getExplorerUrl(network);
  return `${explorer}/tx/${txHash}`;
};

// Helper to get address URL
export const getAddressUrl = (network: string, address: string): string => {
  const explorer = getExplorerUrl(network);
  return `${explorer}/address/${address}`;
};

// ==================== DATE FORMATS ====================
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm:ss';

// ==================== CURRENCY CONVERSION UTILITIES ====================

/**
 * Get the multiplier for a currency (10^decimals)
 * @param currency Currency code
 * @returns Multiplier as BigInt
 */
export const getMultiplier = (currency: keyof typeof CURRENCIES): bigint => {
  const decimals = CURRENCIES[currency]?.decimals ?? 8;
  return BigInt(10) ** BigInt(decimals);
};

/**
 * Convert from smallest unit to big unit (human-readable)
 * @param smallestUnit Amount in smallest unit (cros, wei, cents, etc.)
 * @param currency Currency code
 * @returns Amount as number in big units
 */
export const fromSmallestUnit = (
  smallestUnit: string | bigint | number,
  currency: keyof typeof CURRENCIES
): number => {
  try {
    let value: bigint;
    if (typeof smallestUnit === 'bigint') {
      value = smallestUnit;
    } else if (typeof smallestUnit === 'number') {
      value = BigInt(Math.floor(smallestUnit));
    } else {
      value = BigInt(smallestUnit);
    }
    const multiplier = getMultiplier(currency);
    return Number(value) / Number(multiplier);
  } catch {
    return 0;
  }
};

/**
 * Convert from big unit to smallest unit
 * @param amount Amount in big units (TXC, USD, ETH, etc.)
 * @param currency Currency code
 * @returns Amount in smallest unit as BigInt
 */
export const toSmallestUnit = (
  amount: number | string,
  currency: keyof typeof CURRENCIES
): bigint => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  const multiplier = getMultiplier(currency);
  return BigInt(Math.round(value * Number(multiplier)));
};

/**
 * Format amount from smallest unit to human-readable string
 * @param amount Amount in smallest unit (cros, wei, cents, etc.)
 * @param decimals Number of decimal places for the currency
 * @returns Formatted string
 */
export const formatCryptoAmount = (amount: string | bigint | number, decimals: number): string => {
  try {
    // Convert to BigInt regardless of input type
    let value: bigint;
    if (typeof amount === 'bigint') {
      value = amount;
    } else if (typeof amount === 'number') {
      value = BigInt(Math.floor(amount));
    } else {
      value = BigInt(amount);
    }

    // Use BigInt exponentiation
    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;

    if (fractionalPart === BigInt(0)) {
      return integerPart.toString();
    }

    // Handle negative fractional part
    const absFractional = fractionalPart < BigInt(0) ? -fractionalPart : fractionalPart;
    const fractionalStr = absFractional.toString().padStart(decimals, '0').replace(/0+$/, '');
    return `${integerPart}.${fractionalStr}`;
  } catch {
    return '0';
  }
};

/**
 * Format USD amount from cents to dollars with currency symbol
 * @param cents Amount in cents (smallest unit)
 * @returns Formatted USD string (e.g., "$10.50")
 */
export const formatUsdAmount = (cents: string | bigint | number): string => {
  try {
    let value: number;
    if (typeof cents === 'bigint') {
      value = Number(cents);
    } else if (typeof cents === 'number') {
      value = cents;
    } else {
      value = Number(cents);
    }
    const dollars = value / 100;
    return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  } catch {
    return '$0.00';
  }
};

/**
 * Format any currency amount from smallest unit to human-readable
 * @param smallestUnit Amount in smallest unit
 * @param currency Currency code
 * @param showSymbol Whether to show currency symbol/code
 * @returns Formatted string
 */
export const formatAmount = (
  smallestUnit: string | bigint | number,
  currency: keyof typeof CURRENCIES,
  showSymbol = true
): string => {
  if (currency === 'USD') {
    return formatUsdAmount(smallestUnit);
  }
  const decimals = CURRENCIES[currency]?.decimals ?? 8;
  const formatted = formatCryptoAmount(smallestUnit, decimals);
  return showSymbol ? `${formatted} ${currency}` : formatted;
};

/**
 * Parse amount input (big units) to smallest unit for API calls
 * @param amount Amount in big units (e.g., 10.50 USD, 1.5 TXC)
 * @param currency Currency code
 * @returns Amount in smallest unit as string (for GraphQL BigInt)
 */
export const parseAmountToSmallestUnit = (
  amount: number | string,
  currency: keyof typeof CURRENCIES
): string => toSmallestUnit(amount, currency).toString();
