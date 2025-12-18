import axios, { AxiosInstance } from 'axios';
import { Service } from 'typedi';

import { ENV } from '@/consts';

// Types for Mempool API responses
export interface MempoolBlock {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
}

export interface MempoolTransaction {
  txid: string;
  version: number;
  locktime: number;
  vin: MempoolVin[];
  vout: MempoolVout[];
  size: number;
  weight: number;
  fee: number;
  status: MempoolTxStatus;
}

export interface MempoolVin {
  txid: string;
  vout: number;
  prevout: MempoolVout | null;
  scriptsig: string;
  scriptsig_asm: string;
  witness?: string[];
  is_coinbase: boolean;
  sequence: number;
}

export interface MempoolVout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string;
  value: number;
}

export interface MempoolTxStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

export interface MempoolAddress {
  address: string;
  chain_stats: MempoolAddressStats;
  mempool_stats: MempoolAddressStats;
}

export interface MempoolAddressStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface MempoolUtxo {
  txid: string;
  vout: number;
  status: MempoolTxStatus;
  value: number;
}

export interface MempoolFeeEstimates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

export interface MempoolInfo {
  count: number;
  vsize: number;
  total_fee: number;
  fee_histogram: [number, number][];
}

@Service()
export class MempoolService {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = ENV.MEMPOOL.API;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ==================== Block APIs ====================

  async getBlock(hash: string): Promise<MempoolBlock> {
    const response = await this.client.get<MempoolBlock>(`/block/${hash}`);
    return response.data;
  }

  async getBlockHashByHeight(height: number): Promise<string> {
    const response = await this.client.get<string>(`/block-height/${height}`);
    return response.data;
  }

  async getBlockByHeight(height: number): Promise<MempoolBlock> {
    const hash = await this.getBlockHashByHeight(height);
    return this.getBlock(hash);
  }

  async getBlocks(startHeight?: number): Promise<MempoolBlock[]> {
    const url = startHeight ? `/blocks/${startHeight}` : '/blocks';
    const response = await this.client.get<MempoolBlock[]>(url);
    return response.data;
  }

  async getBlockTip(): Promise<number> {
    const response = await this.client.get<number>('/blocks/tip/height');
    return response.data;
  }

  // ==================== Transaction APIs ====================

  async getTransaction(txid: string): Promise<MempoolTransaction> {
    const response = await this.client.get<MempoolTransaction>(`/tx/${txid}`);
    return response.data;
  }

  async getTransactionHex(txid: string): Promise<string> {
    const response = await this.client.get<string>(`/tx/${txid}/hex`);
    return response.data;
  }

  async broadcastTransaction(txHex: string): Promise<string> {
    const response = await this.client.post<string>('/tx', txHex, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  }

  // ==================== Address APIs ====================

  async getAddress(address: string): Promise<MempoolAddress> {
    const response = await this.client.get<MempoolAddress>(`/address/${address}`);
    return response.data;
  }

  async getAddressChainTransactions(
    address: string,
    afterTxid?: string
  ): Promise<MempoolTransaction[]> {
    const url = afterTxid
      ? `/address/${address}/txs/chain/${afterTxid}`
      : `/address/${address}/txs/chain`;
    const response = await this.client.get<MempoolTransaction[]>(url);
    return response.data;
  }

  /**
   * Get ALL confirmed transactions for an address by paginating through results.
   * The API returns up to 25 transactions per request, so we paginate using afterTxid.
   * @param address - The address to get transactions for
   * @param maxPages - Maximum number of pages to fetch (default: 100, i.e., 2500 txs)
   * @returns All confirmed transactions for the address
   */
  async getAllAddressChainTransactions(
    address: string,
    maxPages: number = 5
  ): Promise<MempoolTransaction[]> {
    const allTransactions: MempoolTransaction[] = [];
    let afterTxid: string | undefined;
    let pageCount = 0;

    while (pageCount < maxPages) {
      const transactions = await this.getAddressChainTransactions(address, afterTxid);

      if (transactions.length === 0) {
        break;
      }

      allTransactions.push(...transactions);

      // If we got less than 25, we've reached the end
      if (transactions.length < 25) {
        break;
      }

      // Use the last txid for the next page
      afterTxid = transactions[transactions.length - 1].txid;
      pageCount++;
    }

    return allTransactions;
  }

  async getAddressMempoolTransactions(address: string): Promise<MempoolTransaction[]> {
    const response = await this.client.get<MempoolTransaction[]>(`/address/${address}/txs/mempool`);
    return response.data;
  }

  async getAddressUtxos(address: string): Promise<MempoolUtxo[]> {
    const response = await this.client.get<MempoolUtxo[]>(`/address/${address}/utxo`);
    return response.data;
  }

  async getAddressBalance(address: string): Promise<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  }> {
    const addressInfo = await this.getAddress(address);
    const confirmed =
      addressInfo.chain_stats.funded_txo_sum - addressInfo.chain_stats.spent_txo_sum;
    const unconfirmed =
      addressInfo.mempool_stats.funded_txo_sum - addressInfo.mempool_stats.spent_txo_sum;
    return {
      confirmed,
      unconfirmed,
      total: confirmed + unconfirmed,
    };
  }

  // ==================== Mempool APIs ====================

  async getMempoolInfo(): Promise<MempoolInfo> {
    const response = await this.client.get<MempoolInfo>('/mempool');
    return response.data;
  }

  async getMempoolTxids(): Promise<string[]> {
    const response = await this.client.get<string[]>('/mempool/txids');
    return response.data;
  }

  // ==================== Fee Estimates ====================

  async getFeeEstimates(): Promise<MempoolFeeEstimates> {
    const response = await this.client.get<MempoolFeeEstimates>('/v1/fees/recommended');
    return response.data;
  }
}
