import axios from 'axios';
import { Service } from 'typedi';

/**
 * CoinMarketCap Service
 *
 * This service fetches cryptocurrency prices from CoinMarketCap API.
 *
 * EXCHANGE RATE CONVENTION:
 * - All exchange rates are returned in BIG UNITS (e.g., USD per TXC, USD per ETH)
 * - Example: If TXC is worth $2.88, getLatestTXCPrice() returns 2.88
 * - These rates can be converted to stored rates using rateToStoredRate() from currency.ts
 *
 * USAGE WITH SMALLEST UNITS:
 * - When converting fiat (cents) to crypto (cros/wei), use fiatToCrypto() from currency.ts
 * - When converting crypto (cros/wei) to fiat (cents), use cryptoToFiat() from currency.ts
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const COINMARKETCAP_API_PREFIX = 'https://pro-api.coinmarketcap.com';

// CoinMarketCap cryptocurrency IDs
const CMC_IDS = {
  TXC: '32744', // Texitcoin
  LTC: '2', // Litecoin
  ETH: '1027', // Ethereum
  USDT: '825', // Tether
  USDC: '3408', // USD Coin
  BTC: '1', // Bitcoin
} as const;

type SupportedCurrency = keyof typeof CMC_IDS;

// Default fallback prices (in USD - big units)
const FALLBACK_PRICES: Record<SupportedCurrency, number> = {
  TXC: 1.88,
  LTC: 100,
  ETH: 3500,
  USDT: 1,
  USDC: 1,
  BTC: 95000,
};

@Service()
export class CoinMarketCapService {
  constructor() {}

  /**
   * Get the latest price of a cryptocurrency in USD (big units)
   * @param coinId CoinMarketCap coin ID
   * @returns Price in USD (e.g., 2.88 for TXC)
   */
  async getLatestPrice(coinId: string): Promise<number> {
    try {
      const res = await axios.get(`${COINMARKETCAP_API_PREFIX}/v1/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        },
        params: {
          id: coinId,
          convert: 'USD',
        },
      });

      return Number(res.data.data[coinId].quote.USD.price.toFixed(8));
    } catch (_err) {
      // Return fallback price based on coinId
      const currency = Object.entries(CMC_IDS).find(([_, id]) => id === coinId)?.[0] as
        | SupportedCurrency
        | undefined;
      return currency ? FALLBACK_PRICES[currency] : 1;
    }
  }

  /**
   * Get exchange rate for a currency pair
   * Returns the price of 1 unit of the crypto in the quote currency (USD by default)
   *
   * @param currency Currency symbol (TXC, ETH, USDC, USDT)
   * @returns Exchange rate in big units (e.g., 2.88 USD per TXC)
   */
  async getExchangeRate(currency: SupportedCurrency): Promise<number> {
    const coinId = CMC_IDS[currency];
    if (!coinId) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
    return this.getLatestPrice(coinId);
  }

  /**
   * Get the price of 1 TXC in USD (big units)
   * @returns USD price per TXC (e.g., 2.88)
   */
  async getLatestTXCPrice(): Promise<number> {
    return this.getLatestPrice(CMC_IDS.TXC);
  }

  /**
   * Get the price of 1 LTC in USD (big units)
   * @returns USD price per LTC
   */
  async getLatestLitecoinPrice(): Promise<number> {
    return this.getLatestPrice(CMC_IDS.LTC);
  }

  /**
   * Get the price of 1 ETH in USD (big units)
   * @returns USD price per ETH (e.g., 3500)
   */
  async getLatestETHPrice(): Promise<number> {
    return this.getLatestPrice(CMC_IDS.ETH);
  }

  /**
   * Get the price of 1 USDT in USD (big units)
   * Should be approximately 1.00
   * @returns USD price per USDT
   */
  async getLatestUSDTPrice(): Promise<number> {
    return this.getLatestPrice(CMC_IDS.USDT);
  }

  /**
   * Get the price of 1 USDC in USD (big units)
   * Should be approximately 1.00
   * @returns USD price per USDC
   */
  async getLatestUSDCPrice(): Promise<number> {
    return this.getLatestPrice(CMC_IDS.USDC);
  }

  /**
   * Get the price of 1 BTC in USD (big units)
   * @returns USD price per BTC
   */
  async getLatestBTCPrice(): Promise<number> {
    return this.getLatestPrice(CMC_IDS.BTC);
  }

  /**
   * Get all supported currency prices at once
   * @returns Object with currency symbols as keys and USD prices as values
   */
  async getAllPrices(): Promise<Record<SupportedCurrency, number>> {
    const ids = Object.values(CMC_IDS).join(',');

    try {
      const res = await axios.get(`${COINMARKETCAP_API_PREFIX}/v1/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        },
        params: {
          id: ids,
          convert: 'USD',
        },
      });

      const prices: Partial<Record<SupportedCurrency, number>> = {};
      for (const [symbol, id] of Object.entries(CMC_IDS)) {
        const data = res.data.data[id];
        if (data?.quote?.USD?.price) {
          prices[symbol as SupportedCurrency] = Number(data.quote.USD.price.toFixed(8));
        } else {
          prices[symbol as SupportedCurrency] = FALLBACK_PRICES[symbol as SupportedCurrency];
        }
      }

      return prices as Record<SupportedCurrency, number>;
    } catch (_err) {
      return { ...FALLBACK_PRICES };
    }
  }
}
