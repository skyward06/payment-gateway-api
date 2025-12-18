import axios from 'axios';
import { Service } from 'typedi';

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const COINMARKETCAP_API_PREFIX = 'https://pro-api.coinmarketcap.com';
const TEXITCOIN_ID = '32744';
const LITECOIN_ID = '2';
const ETH = '1027';
const USDT = '825';
const USDC = '3408';

@Service()
export class CoinMarketCapService {
  constructor() {}
  async getLatestPrice(coinId: string) {
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

      return Number(res.data.data[coinId].quote.USD.price.toFixed(5));
    } catch (_err) {
      return 2.88;
    }
  }

  async getLatestTXCPrice() {
    return this.getLatestPrice(TEXITCOIN_ID);
  }

  async getLatestLitecoinPrice() {
    return this.getLatestPrice(LITECOIN_ID);
  }

  async getLatestETHPrice() {
    return this.getLatestPrice(ETH);
  }

  async getLatestUSDTPrice() {
    return this.getLatestPrice(USDT);
  }

  async getLatestUSDCPrice() {
    return this.getLatestPrice(USDC);
  }
}
