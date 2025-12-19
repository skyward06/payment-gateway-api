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

// ============================================
// Exchange Rate Utilities
// ============================================

/**
 * Exchange rate precision - rates are stored as rate * 10^8
 * Example: 1 TXC = $2.88 USD is stored as 288000000
 */
export const EXCHANGE_RATE_DECIMALS = 8;
export const EXCHANGE_RATE_MULTIPLIER = BigInt(10 ** EXCHANGE_RATE_DECIMALS);

/**
 * Store exchange rate with precision (multiply by 10^8)
 * @param rate Exchange rate in big units (e.g., USD per TXC = 2.88)
 * @returns Rate as BigInt with precision
 */
export function rateToStoredRate(rate: number): bigint {
  return BigInt(Math.round(rate * Number(EXCHANGE_RATE_MULTIPLIER)));
}

/**
 * Convert stored exchange rate to human-readable
 * @param storedRate Rate stored as BigInt
 * @returns Human-readable rate
 */
export function storedRateToRate(storedRate: bigint | number): number {
  const value = typeof storedRate === 'bigint' ? storedRate : BigInt(storedRate);
  return Number(value) / Number(EXCHANGE_RATE_MULTIPLIER);
}

/**
 * Convert fiat amount (smallest unit) to crypto amount (smallest unit) using exchange rate
 *
 * Formula: cryptoSmallestUnit = (fiatSmallestUnit * cryptoMultiplier * RATE_MULTIPLIER) / (fiatMultiplier * storedRate)
 *
 * @param fiatSmallestUnit Amount in fiat smallest unit (e.g., cents)
 * @param storedRate Exchange rate (price of 1 crypto in fiat, multiplied by 10^8)
 * @param fiatCurrency Fiat currency code (e.g., 'USD')
 * @param cryptoCurrency Crypto currency code (e.g., 'TXC')
 * @returns Amount in crypto smallest unit (e.g., cros)
 */
export function fiatToCrypto(
  fiatSmallestUnit: bigint | number,
  storedRate: bigint | number,
  fiatCurrency: CurrencyCode,
  cryptoCurrency: CurrencyCode
): bigint {
  const fiat = typeof fiatSmallestUnit === 'bigint' ? fiatSmallestUnit : BigInt(fiatSmallestUnit);
  const rate = typeof storedRate === 'bigint' ? storedRate : BigInt(storedRate);

  const fiatMultiplier = getMultiplier(fiatCurrency);
  const cryptoMultiplier = getMultiplier(cryptoCurrency);

  // Convert fiat to its big unit, then divide by rate to get crypto big unit, then convert to smallest
  // fiatBigUnit = fiatSmallestUnit / fiatMultiplier
  // cryptoBigUnit = fiatBigUnit / (storedRate / RATE_MULTIPLIER)
  // cryptoSmallestUnit = cryptoBigUnit * cryptoMultiplier
  // Simplified: cryptoSmallestUnit = (fiatSmallestUnit * cryptoMultiplier * RATE_MULTIPLIER) / (fiatMultiplier * storedRate)
  return (fiat * cryptoMultiplier * EXCHANGE_RATE_MULTIPLIER) / (fiatMultiplier * rate);
}

/**
 * Convert crypto amount (smallest unit) to fiat amount (smallest unit) using exchange rate
 *
 * Formula: fiatSmallestUnit = (cryptoSmallestUnit * fiatMultiplier * storedRate) / (cryptoMultiplier * RATE_MULTIPLIER)
 *
 * @param cryptoSmallestUnit Amount in crypto smallest unit (e.g., cros)
 * @param storedRate Exchange rate (price of 1 crypto in fiat, multiplied by 10^8)
 * @param cryptoCurrency Crypto currency code (e.g., 'TXC')
 * @param fiatCurrency Fiat currency code (e.g., 'USD')
 * @returns Amount in fiat smallest unit (e.g., cents)
 */
export function cryptoToFiat(
  cryptoSmallestUnit: bigint | number,
  storedRate: bigint | number,
  cryptoCurrency: CurrencyCode,
  fiatCurrency: CurrencyCode
): bigint {
  const crypto =
    typeof cryptoSmallestUnit === 'bigint' ? cryptoSmallestUnit : BigInt(cryptoSmallestUnit);
  const rate = typeof storedRate === 'bigint' ? storedRate : BigInt(storedRate);

  const cryptoMultiplier = getMultiplier(cryptoCurrency);
  const fiatMultiplier = getMultiplier(fiatCurrency);

  // Convert crypto smallest unit to fiat smallest unit using rate
  // cryptoBigUnit = cryptoSmallestUnit / cryptoMultiplier
  // fiatBigUnit = cryptoBigUnit * (storedRate / RATE_MULTIPLIER)
  // fiatSmallestUnit = fiatBigUnit * fiatMultiplier
  // Simplified: fiatSmallestUnit = (cryptoSmallestUnit * fiatMultiplier * storedRate) / (cryptoMultiplier * RATE_MULTIPLIER)
  return (crypto * fiatMultiplier * rate) / (cryptoMultiplier * EXCHANGE_RATE_MULTIPLIER);
}
