/**
 * Currency conversion utilities
 *
 * All amounts are stored in the smallest unit (cro for TXC, satoshi for BTC, wei for ETH, cents for fiat)
 * These helpers convert between smallest units and human-readable units.
 */

// Currency decimal configurations
export const CURRENCY_DECIMALS = {
  TXC: 8, // 1 TXC = 100,000,000 cro
  BTC: 8, // 1 BTC = 100,000,000 satoshi
  ETH: 18, // 1 ETH = 10^18 wei
  USDC: 6, // 1 USDC = 1,000,000 micro
  USDT: 6, // 1 USDT = 1,000,000 micro
  USD: 2, // 1 USD = 100 cents
} as const;

export type CurrencyCode = keyof typeof CURRENCY_DECIMALS;

/**
 * Get multiplier for a currency (10^decimals)
 */
export function getMultiplier(currency: CurrencyCode): bigint {
  return BigInt(10 ** CURRENCY_DECIMALS[currency]);
}

/**
 * Convert from smallest unit to human-readable amount
 * @param smallestUnit Amount in smallest unit (BigInt or number)
 * @param currency Currency code
 * @returns Amount as a number
 */
export function fromSmallestUnit(smallestUnit: bigint | number, currency: CurrencyCode): number {
  const value = typeof smallestUnit === 'bigint' ? smallestUnit : BigInt(smallestUnit);
  return Number(value) / Number(getMultiplier(currency));
}

/**
 * Convert from human-readable amount to smallest unit
 * @param amount Amount in human-readable format
 * @param currency Currency code
 * @returns Amount in smallest unit as BigInt
 */
export function toSmallestUnit(amount: number | string, currency: CurrencyCode): bigint {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.round(value * Number(getMultiplier(currency))));
}

/**
 * Format smallest unit as human-readable string
 * @param smallestUnit Amount in smallest unit
 * @param currency Currency code
 * @param decimals Number of decimal places to show (defaults to currency decimals)
 * @returns Formatted string
 */
export function formatCurrency(
  smallestUnit: bigint | number,
  currency: CurrencyCode,
  decimals?: number
): string {
  const d = decimals ?? CURRENCY_DECIMALS[currency];
  return fromSmallestUnit(smallestUnit, currency).toFixed(d);
}

/**
 * Parse amount string to BigInt in smallest unit (generic version)
 * @param amount Amount string (e.g., "1.5")
 * @param decimals Number of decimal places for the currency
 * @returns Amount in smallest unit as BigInt
 */
export function parseAmount(amount: string | number, decimals: number): bigint {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.round(value * 10 ** decimals));
}

/**
 * Format amount from smallest unit to human-readable (generic version)
 * @param amount Amount in smallest unit
 * @param decimals Number of decimal places for the currency
 * @returns Human-readable amount as number
 */
export function formatAmount(amount: bigint | number, decimals: number): number {
  const a = typeof amount === 'bigint' ? amount : BigInt(amount);
  return Number(a) / 10 ** decimals;
}

// ============================================
// Convenience aliases for common conversions
// ============================================

// TXC (cro)
export const croToTxc = (cro: bigint | number) => fromSmallestUnit(cro, 'TXC');
export const txcToCro = (txc: number | string) => toSmallestUnit(txc, 'TXC');
export const formatTxc = (cro: bigint | number, decimals = 8) =>
  formatCurrency(cro, 'TXC', decimals);

// BTC (satoshi)
export const satoshiToBtc = (satoshi: bigint | number) => fromSmallestUnit(satoshi, 'BTC');
export const btcToSatoshi = (btc: number | string) => toSmallestUnit(btc, 'BTC');
export const formatBtc = (satoshi: bigint | number, decimals = 8) =>
  formatCurrency(satoshi, 'BTC', decimals);

// ETH (wei)
export const weiToEth = (wei: bigint | number) => fromSmallestUnit(wei, 'ETH');
export const ethToWei = (eth: number | string) => toSmallestUnit(eth, 'ETH');
export const formatEth = (wei: bigint | number, decimals = 18) =>
  formatCurrency(wei, 'ETH', decimals);

// USD (cents)
export const centsToDollars = (cents: bigint | number) => fromSmallestUnit(cents, 'USD');
export const dollarsToCents = (dollars: number | string) => toSmallestUnit(dollars, 'USD');
export const formatDollars = (cents: bigint | number, decimals = 2) =>
  formatCurrency(cents, 'USD', decimals);

// Legacy exports for backwards compatibility
export const CRO_PER_TXC = getMultiplier('TXC');
export const SATOSHI_PER_BTC = getMultiplier('BTC');
export const WEI_PER_ETH = getMultiplier('ETH');
export const CENTS_PER_DOLLAR = getMultiplier('USD');
