import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { Service } from 'typedi';

import { TXC_EXPLORER } from '@/consts';
import { TexitcoinNetwork } from '@/consts/texitcoin';
import { MempoolService, MempoolUtxo } from './mempool';

const ECPair = ECPairFactory(ecc);

// Initialize the ECC library for bitcoinjs-lib
bitcoin.initEccLib(ecc);

export enum AddressType {
  P2PKH = 0,
  BECH32 = 1,
}

export interface TransactionOutput {
  address?: string;
  script?: Uint8Array;
  amount: bigint;
}

export interface SweepResult {
  txHex: string;
  txHash: string;
  totalInput: bigint;
  fee: bigint;
  amountSent: bigint;
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

    getOutputScriptSize(output: TransactionOutput): number {
    if (output.script) {
      return output.script.length;
    }

    if (output.address) {
      const addressType = this.getAddressType(output.address);
      if (addressType === AddressType.BECH32) {
        return 22; // P2WPKH script size
      } else {
        return 25; // P2PKH script size
      }
    }

    throw new Error('Output must have address or script');
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

  /**
   * Build and sign a sweep transaction that sends ALL UTXOs from an address
   * to a single destination, minus the transaction fee. No change output.
   *
   * @param senderPrivKey - WIF-encoded private key of the source address
   * @param addressType - Address type of the source (BECH32 or P2PKH)
   * @param toAddress - Destination address (merchant wallet)
   * @param feeRate - Fee rate in sat/KB (if not provided, defaults to 1000)
   * @returns SweepResult with transaction hex, hash, amounts
   */
  async makeSweepTransaction({
    senderPrivKey,
    addressType,
    toAddress,
    feeRate = 10,
  }: {
    senderPrivKey: string;
    addressType: AddressType;
    toAddress: string;
    feeRate?: number;
  }): Promise<SweepResult> {
    const sender = ECPair.fromWIF(senderPrivKey, TexitcoinNetwork);
    const senderAddress = this.getAddressFromPrivKey(senderPrivKey, addressType);

    if (!senderAddress) {
      throw new Error('Invalid sender address');
    }

    const utxos = await this.mempoolService.getAddressUtxos(senderAddress);

    if (utxos.length === 0) {
      throw new Error('No UTXOs available for sweep');
    }

    // Calculate total input amount
    const totalInput = utxos.reduce((sum, utxo) => sum + BigInt(utxo.value), 0n);

    // Determine output script size based on destination address type
    const toAddressType = this.getAddressType(toAddress);
    const outputScriptSize = toAddressType === AddressType.BECH32 ? 22 : 25;

    // Calculate transaction size (all inputs, single output, no change)
    let overhead = 10;
    let inputSize: number;
    if (addressType === AddressType.BECH32) {
      inputSize = 68;
      overhead += 2;
    } else {
      inputSize = 148;
    }
    const outputSize = 8 + 1 + outputScriptSize;
    const estimatedVSize = overhead + utxos.length * inputSize + outputSize;

    // Calculate fee using CFeeRate logic: nSatoshisPerK * nSize / 1000
    const fee = BigInt(Math.ceil(((feeRate * estimatedVSize) / 1000) * 1000));

    const amountSent = totalInput - fee;

    // Check if sweep is viable (above dust threshold)
    const dustThreshold = this.getDustThreshold(
      toAddressType === AddressType.BECH32 ? AddressType.BECH32 : AddressType.P2PKH
    );

    if (amountSent <= dustThreshold) {
      throw new Error(
        `Sweep amount (${amountSent} cros) is below dust threshold (${dustThreshold} cros) after fees`
      );
    }

    // Build the transaction
    const psbt = new bitcoin.Psbt({ network: TexitcoinNetwork });

    // Get raw transactions for inputs
    const rawTxs = await Promise.all(
      utxos.map((utxo) => this.mempoolService.getTransactionHex(utxo.txid))
    );

    // Add all UTXOs as inputs
    rawTxs.forEach((hex, index) => {
      const input: any = {
        hash: utxos[index].txid,
        index: utxos[index].vout,
        nonWitnessUtxo: Buffer.from(hex, 'hex'),
      };
      psbt.addInput(input);
    });

    // Add single output to destination
    psbt.addOutput({
      address: toAddress,
      value: amountSent,
    });

    // Sign all inputs
    psbt.signAllInputs(sender);
    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction();

    return {
      txHex: tx.toHex(),
      txHash: tx.getId(),
      totalInput,
      fee,
      amountSent,
    };
  }
}
