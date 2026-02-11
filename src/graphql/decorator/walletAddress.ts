import * as bitcoin from 'bitcoinjs-lib';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAddress } from 'ethers';

import { TexitcoinNetwork } from '@/consts/texitcoin';
import { PaymentNetwork } from '@/generated/prisma/client';

function isValidTxcAddress(address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address, TexitcoinNetwork);
    return true;
  } catch {
    return false;
  }
}

@ValidatorConstraint({ name: 'isValidWalletAddress', async: false })
export class IsValidWalletAddressConstraint implements ValidatorConstraintInterface {
  validate(walletAddress: string, args: ValidationArguments): boolean {
    if (!walletAddress) return true; // let @IsNotEmpty or @IsOptional handle emptiness

    const object = args.object as Record<string, any>;
    const network: PaymentNetwork | undefined = object.network;

    if (!network) return false; // can't validate without network context

    switch (network) {
      case PaymentNetwork.TXC:
        return isValidTxcAddress(walletAddress);
      case PaymentNetwork.ETH:
      case PaymentNetwork.BASE:
      case PaymentNetwork.BSC:
      case PaymentNetwork.POLYGON:
        return isAddress(walletAddress);
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as Record<string, any>;
    const network: PaymentNetwork | undefined = object.network;

    if (!network) return 'Network is required to validate wallet address.';

    switch (network) {
      case PaymentNetwork.TXC:
        return 'Invalid TXC wallet address. Address must start with "txc1" (bech32) or "T" (legacy).';
      case PaymentNetwork.ETH:
      case PaymentNetwork.BASE:
      case PaymentNetwork.BSC:
      case PaymentNetwork.POLYGON:
        return 'Invalid EVM wallet address. Address must be a valid 0x-prefixed hex address.';
      default:
        return `Unsupported network: ${network}`;
    }
  }
}

export function IsValidWalletAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidWalletAddressConstraint,
    });
  };
}
