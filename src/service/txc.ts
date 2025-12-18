import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { Service } from 'typedi';

import { TXC_EXPLORER } from '@/consts';
import { TexitcoinNetwork } from '@/consts/texitcoin';
import { MempoolService } from './mempool';

const ECPair = ECPairFactory(ecc);

export enum AddressType {
  P2PKH = 0,
  BECH32 = 1,
}

export interface TransactionOutput {
  address?: string;
  script?: Uint8Array;
  amount: bigint;
}

@Service()
export class TXCService {
  constructor(private readonly mempoolService: MempoolService) {}

  getExplorerTransaction(): string {
    return `${TXC_EXPLORER}/tx`;
  }

  getAddressFromPrivKey(privKey: string, addressType: AddressType): string | undefined {
    const sender = ECPair.fromWIF(privKey, TexitcoinNetwork);
    switch (addressType) {
      case AddressType.BECH32:
        return bitcoin.payments.p2wpkh({
          pubkey: sender.publicKey,
          network: TexitcoinNetwork,
        }).address;
      case AddressType.P2PKH:
      default:
        return bitcoin.payments.p2pkh({
          pubkey: sender.publicKey,
          network: TexitcoinNetwork,
        }).address;
    }
  }

  generateNewAddress(addressType: AddressType = AddressType.BECH32): {
    address: string;
    privateKey: string;
  } {
    const keyPair = ECPair.makeRandom({ network: TexitcoinNetwork });

    switch (addressType) {
      case AddressType.BECH32:
        return {
          address:
            bitcoin.payments.p2wpkh({
              pubkey: Uint8Array.from(keyPair.publicKey),
              network: TexitcoinNetwork,
            }).address ?? '',
          privateKey: keyPair.toWIF(),
        };
      case AddressType.P2PKH:
      default:
        return {
          address:
            bitcoin.payments.p2pkh({
              pubkey: Uint8Array.from(keyPair.publicKey),
              network: TexitcoinNetwork,
            }).address ?? '',
          privateKey: keyPair.toWIF(),
        };
    }
  }

  getAddressType(address: string): AddressType | null {
    if (address.startsWith('txc1')) {
      return AddressType.BECH32;
    } else if (address.startsWith('T')) {
      return AddressType.P2PKH;
    }
    return null;
  }

  isValidAddress(address: string): boolean {
    try {
      if (address.startsWith('txc1')) {
        bitcoin.address.fromBech32(address);
        return true;
      } else if (address.startsWith('T')) {
        bitcoin.address.fromBase58Check(address);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getDustThreshold(scriptType: AddressType): bigint {
    const dustRelayFee = 3000;
    let spendSize: number;

    if (scriptType === AddressType.BECH32) {
      spendSize = 98;
    } else {
      spendSize = 148;
    }

    return BigInt(Math.ceil((spendSize * dustRelayFee) / 1000));
  }

  // Get balance for an address using Mempool API
  async getAddressBalance(address: string): Promise<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  }> {
    return this.mempoolService.getAddressBalance(address);
  }

  // Get transactions for an address (single page, up to 25)
  async getAddressChainTransactions(address: string, afterTxid?: string) {
    return this.mempoolService.getAddressChainTransactions(address, afterTxid);
  }

  // Get ALL transactions for an address (paginated, fetches all)
  async getAllAddressChainTransactions(address: string, maxPages?: number) {
    return this.mempoolService.getAllAddressChainTransactions(address, maxPages);
  }

  // Get mempool (unconfirmed) transactions for an address
  async getAddressMempoolTransactions(address: string) {
    return this.mempoolService.getAddressMempoolTransactions(address);
  }

  // Get UTXOs for an address
  async getAddressUtxos(address: string) {
    return this.mempoolService.getAddressUtxos(address);
  }

  // Get transaction details
  async getTransaction(txid: string) {
    return this.mempoolService.getTransaction(txid);
  }

  // Get current block height
  async getBlockHeight(): Promise<number> {
    return this.mempoolService.getBlockTip();
  }

  // Broadcast a signed transaction
  async broadcastTransaction(txHex: string): Promise<string> {
    return this.mempoolService.broadcastTransaction(txHex);
  }
}
