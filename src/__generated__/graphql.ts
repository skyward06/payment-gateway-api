/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AddMerchantNetworkInput = {
  currency: PaymentCurrency;
  network: PaymentNetwork;
  walletAddress: Scalars['String']['input'];
};

export type Admin = {
  __typename?: 'Admin';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AdminListResponse = {
  __typename?: 'AdminListResponse';
  admins: Array<Admin>;
  total: Scalars['Float']['output'];
};

export type AdminLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AdminLoginResponse = {
  __typename?: 'AdminLoginResponse';
  admin: Admin;
  token: Scalars['String']['output'];
};

export type AdminUpdateMerchantInput = {
  allowPartialPayments?: InputMaybe<Scalars['Boolean']['input']>;
  autoConfirmations?: InputMaybe<Scalars['Int']['input']>;
  collectCustomerEmail?: InputMaybe<Scalars['Boolean']['input']>;
  defaultExpirationMinutes?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  webhookUrl?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type AllExchangeRates = {
  __typename?: 'AllExchangeRates';
  rates: Array<ExchangeRateInfo>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type ApiKey = {
  __typename?: 'ApiKey';
  allowedIPs: Array<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastUsedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  merchantId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  publicKey: Scalars['String']['output'];
  rateLimit: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type ApiKeyListResponse = {
  __typename?: 'ApiKeyListResponse';
  apiKeys: Array<ApiKey>;
  total: Scalars['Float']['output'];
};

export type ApiKeyWithSecret = {
  __typename?: 'ApiKeyWithSecret';
  apiKey: ApiKey;
  secretKey: Scalars['String']['output'];
};

export type CreateAdminInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type CreateApiKeyInput = {
  allowedIPs?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  name: Scalars['String']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  rateLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMerchantInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePaymentInput = {
  amount: Scalars['BigInt']['input'];
  cancelUrl?: InputMaybe<Scalars['String']['input']>;
  currency: PaymentCurrency;
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  customerName?: InputMaybe<Scalars['String']['input']>;
  expirationMinutes?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fiatCurrency?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  network: PaymentNetwork;
  successUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ExchangeRateInfo = {
  __typename?: 'ExchangeRateInfo';
  currency: Scalars['String']['output'];
  priceUSD: Scalars['Float']['output'];
};

export type IdInput = {
  id: Scalars['ID']['input'];
};

export type Merchant = {
  __typename?: 'Merchant';
  allowPartialPayments: Scalars['Boolean']['output'];
  apiKeys?: Maybe<Array<ApiKey>>;
  autoConfirmations: Scalars['Float']['output'];
  collectCustomerEmail: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  defaultExpirationMinutes: Scalars['Float']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  supportedNetworks?: Maybe<Array<MerchantNetwork>>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  verifiedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Only visible to authenticated merchant or admin */
  webhookSecret?: Maybe<Scalars['String']['output']>;
  webhookUrl?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type MerchantListResponse = {
  __typename?: 'MerchantListResponse';
  merchants: Array<Merchant>;
  total: Scalars['Float']['output'];
};

export type MerchantLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MerchantLoginResponse = {
  __typename?: 'MerchantLoginResponse';
  merchant: Merchant;
  token: Scalars['String']['output'];
};

export type MerchantNetwork = {
  __typename?: 'MerchantNetwork';
  createdAt: Scalars['DateTimeISO']['output'];
  currency: PaymentCurrency;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  merchantId: Scalars['String']['output'];
  network: PaymentNetwork;
  updatedAt: Scalars['DateTimeISO']['output'];
  walletAddress: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateAdmin: Admin;
  activateMerchant: Merchant;
  addMerchantNetwork: MerchantNetwork;
  adminLogin: AdminLoginResponse;
  adminRevokeApiKey: ApiKey;
  adminUpdateMerchant: Merchant;
  cancelPayment: Payment;
  createAdmin: Admin;
  createApiKey: ApiKeyWithSecret;
  createPayment: Payment;
  deactivateAdmin: Admin;
  deactivateMerchant: Merchant;
  deleteMerchant: Merchant;
  merchantLogin: MerchantLoginResponse;
  regenerateWebhookSecret: Scalars['String']['output'];
  registerMerchant: Merchant;
  removeAdmin: Admin;
  removeMerchantNetwork: MerchantNetwork;
  revokeApiKey: ApiKey;
  rotateApiKeySecret: ApiKeyWithSecret;
  unverifyMerchant: Merchant;
  updateAdmin: Admin;
  updateApiKey: ApiKey;
  updateMerchantNetwork: MerchantNetwork;
  updateMerchantProfile: Merchant;
  verifyMerchant: Merchant;
};


export type MutationActivateAdminArgs = {
  data: IdInput;
};


export type MutationActivateMerchantArgs = {
  data: IdInput;
};


export type MutationAddMerchantNetworkArgs = {
  data: AddMerchantNetworkInput;
};


export type MutationAdminLoginArgs = {
  data: AdminLoginInput;
};


export type MutationAdminRevokeApiKeyArgs = {
  data: IdInput;
};


export type MutationAdminUpdateMerchantArgs = {
  data: AdminUpdateMerchantInput;
};


export type MutationCancelPaymentArgs = {
  apiKey: Scalars['String']['input'];
  data: IdInput;
};


export type MutationCreateAdminArgs = {
  data: CreateAdminInput;
};


export type MutationCreateApiKeyArgs = {
  data: CreateApiKeyInput;
};


export type MutationCreatePaymentArgs = {
  apiKey: Scalars['String']['input'];
  data: CreatePaymentInput;
};


export type MutationDeactivateAdminArgs = {
  data: IdInput;
};


export type MutationDeactivateMerchantArgs = {
  data: IdInput;
};


export type MutationDeleteMerchantArgs = {
  data: IdInput;
};


export type MutationMerchantLoginArgs = {
  data: MerchantLoginInput;
};


export type MutationRegisterMerchantArgs = {
  data: CreateMerchantInput;
};


export type MutationRemoveAdminArgs = {
  data: IdInput;
};


export type MutationRemoveMerchantNetworkArgs = {
  data: IdInput;
};


export type MutationRevokeApiKeyArgs = {
  data: IdInput;
};


export type MutationRotateApiKeySecretArgs = {
  data: IdInput;
};


export type MutationUnverifyMerchantArgs = {
  data: IdInput;
};


export type MutationUpdateAdminArgs = {
  data: UpdateAdminInput;
};


export type MutationUpdateApiKeyArgs = {
  data: UpdateApiKeyInput;
};


export type MutationUpdateMerchantNetworkArgs = {
  data: UpdateMerchantNetworkInput;
};


export type MutationUpdateMerchantProfileArgs = {
  data: UpdateMerchantInput;
};


export type MutationVerifyMerchantArgs = {
  data: IdInput;
};

export type Payment = {
  __typename?: 'Payment';
  amountPaid: Scalars['BigInt']['output'];
  amountRequested: Scalars['BigInt']['output'];
  cancelUrl?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  confirmedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  currency: PaymentCurrency;
  currentConfirmations: Scalars['Int']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerName?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  detectedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  exchangeRate?: Maybe<Scalars['BigInt']['output']>;
  expiresAt: Scalars['DateTimeISO']['output'];
  externalId?: Maybe<Scalars['String']['output']>;
  fiatAmount?: Maybe<Scalars['BigInt']['output']>;
  fiatCurrency?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  merchant?: Maybe<Merchant>;
  merchantId: Scalars['String']['output'];
  network: PaymentNetwork;
  paymentAddress: Scalars['String']['output'];
  requiredConfirmations: Scalars['Int']['output'];
  status: PaymentStatus;
  successUrl?: Maybe<Scalars['String']['output']>;
  transactions?: Maybe<Array<PaymentTransaction>>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export enum PaymentCurrency {
  Eth = 'ETH',
  Txc = 'TXC',
  Usdc = 'USDC',
  Usdt = 'USDT'
}

export type PaymentListResponse = {
  __typename?: 'PaymentListResponse';
  payments: Array<Payment>;
  total: Scalars['Float']['output'];
};

export type PaymentMethodInfo = {
  __typename?: 'PaymentMethodInfo';
  currencies: Array<PaymentCurrency>;
  enabled: Scalars['Boolean']['output'];
  network: PaymentNetwork;
};

export enum PaymentNetwork {
  Base = 'BASE',
  Bsc = 'BSC',
  Eth = 'ETH',
  Polygon = 'POLYGON',
  Txc = 'TXC'
}

export enum PaymentStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirming = 'CONFIRMING',
  Detected = 'DETECTED',
  Expired = 'EXPIRED',
  Overpaid = 'OVERPAID',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Underpaid = 'UNDERPAID'
}

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['BigInt']['output'];
  blockHash?: Maybe<Scalars['String']['output']>;
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  confirmations: Scalars['Int']['output'];
  confirmedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  fromAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isConfirmed: Scalars['Boolean']['output'];
  network: PaymentNetwork;
  paymentId: Scalars['String']['output'];
  toAddress: Scalars['String']['output'];
  txHash: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type PaymentWhereInput = {
  currency?: InputMaybe<PaymentCurrency>;
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<PaymentNetwork>;
  status?: InputMaybe<PaymentStatus>;
  toDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type Query = {
  __typename?: 'Query';
  admin: Admin;
  adminPayments: PaymentListResponse;
  admins: AdminListResponse;
  allExchangeRates: AllExchangeRates;
  apiKeys: ApiKeyListResponse;
  merchant?: Maybe<Merchant>;
  merchantMe: Merchant;
  merchants: MerchantListResponse;
  myApiKeys: ApiKeyListResponse;
  myPayments: PaymentListResponse;
  payment?: Maybe<Payment>;
  paymentByExternalId?: Maybe<Payment>;
  paymentMethods: Array<PaymentMethodInfo>;
  payments: PaymentListResponse;
  tokenPrice: TokenPriceInfo;
};


export type QueryAdminArgs = {
  data: IdInput;
};


export type QueryAdminPaymentsArgs = {
  orderBy?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentWhereInput>;
};


export type QueryAdminsArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryApiKeysArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMerchantArgs = {
  data: IdInput;
};


export type QueryMerchantsArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyApiKeysArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyPaymentsArgs = {
  orderBy?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentWhereInput>;
};


export type QueryPaymentArgs = {
  data: IdInput;
};


export type QueryPaymentByExternalIdArgs = {
  apiKey: Scalars['String']['input'];
  externalId: Scalars['String']['input'];
};


export type QueryPaymentMethodsArgs = {
  apiKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPaymentsArgs = {
  apiKey: Scalars['String']['input'];
  orderBy?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentWhereInput>;
};


export type QueryTokenPriceArgs = {
  currency: PaymentCurrency;
};

export type TokenPriceInfo = {
  __typename?: 'TokenPriceInfo';
  currency: PaymentCurrency;
  priceUSD: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type UpdateAdminInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateApiKeyInput = {
  allowedIPs?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  id: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  rateLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateMerchantInput = {
  allowPartialPayments?: InputMaybe<Scalars['Boolean']['input']>;
  autoConfirmations?: InputMaybe<Scalars['Int']['input']>;
  collectCustomerEmail?: InputMaybe<Scalars['Boolean']['input']>;
  defaultExpirationMinutes?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  webhookUrl?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMerchantNetworkInput = {
  id: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Merchant = 'MERCHANT'
}

export type AdminLoginMutationVariables = Exact<{
  data: AdminLoginInput;
}>;


export type AdminLoginMutation = { __typename?: 'Mutation', adminLogin: { __typename?: 'AdminLoginResponse', token: string, admin: { __typename?: 'Admin', id: string, email: string, name?: string | null, role: UserRole, isActive: boolean, createdAt?: any | null } } };

export type MerchantLoginMutationVariables = Exact<{
  data: MerchantLoginInput;
}>;


export type MerchantLoginMutation = { __typename?: 'Mutation', merchantLogin: { __typename?: 'MerchantLoginResponse', token: string, merchant: { __typename?: 'Merchant', id: string, name: string, email: string, website?: string | null, logoUrl?: string | null, isActive: boolean, createdAt?: any | null } } };

export type RegisterMerchantMutationVariables = Exact<{
  data: CreateMerchantInput;
}>;


export type RegisterMerchantMutation = { __typename?: 'Mutation', registerMerchant: { __typename?: 'Merchant', id: string, name: string, email: string } };

export type GetMerchantMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMerchantMeQuery = { __typename?: 'Query', merchantMe: { __typename?: 'Merchant', id: string, name: string, email: string, website?: string | null, logoUrl?: string | null, description?: string | null, webhookUrl?: string | null, webhookSecret?: string | null, defaultExpirationMinutes: number, autoConfirmations: number, allowPartialPayments: boolean, collectCustomerEmail: boolean, isActive: boolean, verifiedAt?: any | null, createdAt?: any | null, supportedNetworks?: Array<{ __typename?: 'MerchantNetwork', id: string, network: PaymentNetwork, currency: PaymentCurrency, isActive: boolean, walletAddress: string }> | null } };

export type UpdateMerchantProfileMutationVariables = Exact<{
  data: UpdateMerchantInput;
}>;


export type UpdateMerchantProfileMutation = { __typename?: 'Mutation', updateMerchantProfile: { __typename?: 'Merchant', id: string, name: string, email: string, website?: string | null, webhookUrl?: string | null, description?: string | null, defaultExpirationMinutes: number, autoConfirmations: number, allowPartialPayments: boolean, collectCustomerEmail: boolean } };

export type AdminUpdateMerchantMutationVariables = Exact<{
  data: AdminUpdateMerchantInput;
}>;


export type AdminUpdateMerchantMutation = { __typename?: 'Mutation', adminUpdateMerchant: { __typename?: 'Merchant', id: string, name: string, email: string, website?: string | null, webhookUrl?: string | null, description?: string | null, defaultExpirationMinutes: number, autoConfirmations: number, allowPartialPayments: boolean, collectCustomerEmail: boolean, isActive: boolean, verifiedAt?: any | null } };

export type GetMerchantsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMerchantsQuery = { __typename?: 'Query', merchants: { __typename?: 'MerchantListResponse', total: number, merchants: Array<{ __typename?: 'Merchant', id: string, name: string, email: string, website?: string | null, isActive: boolean, verifiedAt?: any | null, createdAt?: any | null }> } };

export type GetMerchantQueryVariables = Exact<{
  data: IdInput;
}>;


export type GetMerchantQuery = { __typename?: 'Query', merchant?: { __typename?: 'Merchant', id: string, name: string, email: string, website?: string | null, logoUrl?: string | null, description?: string | null, webhookUrl?: string | null, webhookSecret?: string | null, defaultExpirationMinutes: number, autoConfirmations: number, allowPartialPayments: boolean, collectCustomerEmail: boolean, isActive: boolean, verifiedAt?: any | null, createdAt?: any | null, supportedNetworks?: Array<{ __typename?: 'MerchantNetwork', id: string, network: PaymentNetwork, currency: PaymentCurrency, isActive: boolean, walletAddress: string }> | null } | null };

export type ActivateMerchantMutationVariables = Exact<{
  data: IdInput;
}>;


export type ActivateMerchantMutation = { __typename?: 'Mutation', activateMerchant: { __typename?: 'Merchant', id: string, isActive: boolean } };

export type DeactivateMerchantMutationVariables = Exact<{
  data: IdInput;
}>;


export type DeactivateMerchantMutation = { __typename?: 'Mutation', deactivateMerchant: { __typename?: 'Merchant', id: string, isActive: boolean } };

export type VerifyMerchantMutationVariables = Exact<{
  data: IdInput;
}>;


export type VerifyMerchantMutation = { __typename?: 'Mutation', verifyMerchant: { __typename?: 'Merchant', id: string, verifiedAt?: any | null } };

export type UnverifyMerchantMutationVariables = Exact<{
  data: IdInput;
}>;


export type UnverifyMerchantMutation = { __typename?: 'Mutation', unverifyMerchant: { __typename?: 'Merchant', id: string, verifiedAt?: any | null } };

export type DeleteMerchantMutationVariables = Exact<{
  data: IdInput;
}>;


export type DeleteMerchantMutation = { __typename?: 'Mutation', deleteMerchant: { __typename?: 'Merchant', id: string } };

export type AddMerchantNetworkMutationVariables = Exact<{
  data: AddMerchantNetworkInput;
}>;


export type AddMerchantNetworkMutation = { __typename?: 'Mutation', addMerchantNetwork: { __typename?: 'MerchantNetwork', id: string, network: PaymentNetwork, currency: PaymentCurrency, isActive: boolean, walletAddress: string } };

export type UpdateMerchantNetworkMutationVariables = Exact<{
  data: UpdateMerchantNetworkInput;
}>;


export type UpdateMerchantNetworkMutation = { __typename?: 'Mutation', updateMerchantNetwork: { __typename?: 'MerchantNetwork', id: string, network: PaymentNetwork, currency: PaymentCurrency, isActive: boolean, walletAddress: string } };

export type RemoveMerchantNetworkMutationVariables = Exact<{
  data: IdInput;
}>;


export type RemoveMerchantNetworkMutation = { __typename?: 'Mutation', removeMerchantNetwork: { __typename?: 'MerchantNetwork', id: string } };

export type GetApiKeysQueryVariables = Exact<{
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetApiKeysQuery = { __typename?: 'Query', myApiKeys: { __typename?: 'ApiKeyListResponse', total: number, apiKeys: Array<{ __typename?: 'ApiKey', id: string, name: string, publicKey: string, description?: string | null, permissions: Array<string>, isActive: boolean, lastUsedAt?: any | null, expiresAt?: any | null, createdAt?: any | null }> } };

export type CreateApiKeyMutationVariables = Exact<{
  data: CreateApiKeyInput;
}>;


export type CreateApiKeyMutation = { __typename?: 'Mutation', createApiKey: { __typename?: 'ApiKeyWithSecret', secretKey: string, apiKey: { __typename?: 'ApiKey', id: string, name: string, publicKey: string, isActive: boolean } } };

export type RevokeApiKeyMutationVariables = Exact<{
  data: IdInput;
}>;


export type RevokeApiKeyMutation = { __typename?: 'Mutation', revokeApiKey: { __typename?: 'ApiKey', id: string, isActive: boolean } };

export type GetPaymentQueryVariables = Exact<{
  data: IdInput;
}>;


export type GetPaymentQuery = { __typename?: 'Query', payment?: { __typename?: 'Payment', id: string, externalId?: string | null, amountRequested: any, amountPaid: any, fiatAmount?: any | null, fiatCurrency?: string | null, network: PaymentNetwork, currency: PaymentCurrency, paymentAddress: string, status: PaymentStatus, requiredConfirmations: number, currentConfirmations: number, expiresAt: any, detectedAt?: any | null, confirmedAt?: any | null, completedAt?: any | null, customerEmail?: string | null, customerName?: string | null, successUrl?: string | null, cancelUrl?: string | null, merchantId: string, createdAt?: any | null, transactions?: Array<{ __typename?: 'PaymentTransaction', id: string, txHash: string, amount: any, confirmations: number, isConfirmed: boolean, createdAt: any }> | null } | null };

export type GetMyPaymentsQueryVariables = Exact<{
  where?: InputMaybe<PaymentWhereInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMyPaymentsQuery = { __typename?: 'Query', myPayments: { __typename?: 'PaymentListResponse', total: number, payments: Array<{ __typename?: 'Payment', id: string, externalId?: string | null, amountRequested: any, amountPaid: any, network: PaymentNetwork, currency: PaymentCurrency, status: PaymentStatus, expiresAt: any, createdAt?: any | null, merchantId: string }> } };

export type GetAdminPaymentsQueryVariables = Exact<{
  where?: InputMaybe<PaymentWhereInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAdminPaymentsQuery = { __typename?: 'Query', adminPayments: { __typename?: 'PaymentListResponse', total: number, payments: Array<{ __typename?: 'Payment', id: string, externalId?: string | null, amountRequested: any, amountPaid: any, network: PaymentNetwork, currency: PaymentCurrency, status: PaymentStatus, expiresAt: any, createdAt?: any | null, merchantId: string }> } };

export type CreatePaymentMutationVariables = Exact<{
  apiKey: Scalars['String']['input'];
  data: CreatePaymentInput;
}>;


export type CreatePaymentMutation = { __typename?: 'Mutation', createPayment: { __typename?: 'Payment', id: string, paymentAddress: string, amountRequested: any, network: PaymentNetwork, currency: PaymentCurrency, status: PaymentStatus, expiresAt: any } };

export type GetPaymentMethodsQueryVariables = Exact<{
  apiKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPaymentMethodsQuery = { __typename?: 'Query', paymentMethods: Array<{ __typename?: 'PaymentMethodInfo', network: PaymentNetwork, currencies: Array<PaymentCurrency>, enabled: boolean }> };

export type GetTokenPriceQueryVariables = Exact<{
  currency: PaymentCurrency;
}>;


export type GetTokenPriceQuery = { __typename?: 'Query', tokenPrice: { __typename?: 'TokenPriceInfo', currency: PaymentCurrency, priceUSD: number, updatedAt: any } };

export type GetAllExchangeRatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllExchangeRatesQuery = { __typename?: 'Query', allExchangeRates: { __typename?: 'AllExchangeRates', updatedAt: any, rates: Array<{ __typename?: 'ExchangeRateInfo', currency: string, priceUSD: number }> } };

export type AdminQueryVariables = Exact<{
  data: IdInput;
}>;


export type AdminQuery = { __typename?: 'Query', admin: { __typename?: 'Admin', id: string, email: string, name?: string | null, role: UserRole, isActive: boolean, createdAt?: any | null } };

export type AdminsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AdminsQuery = { __typename?: 'Query', admins: { __typename?: 'AdminListResponse', total: number, admins: Array<{ __typename?: 'Admin', id: string, email: string, name?: string | null, role: UserRole, isActive: boolean, createdAt?: any | null }> } };

export type CreateAdminMutationVariables = Exact<{
  data: CreateAdminInput;
}>;


export type CreateAdminMutation = { __typename?: 'Mutation', createAdmin: { __typename?: 'Admin', id: string } };

export type UpdateAdminMutationVariables = Exact<{
  data: UpdateAdminInput;
}>;


export type UpdateAdminMutation = { __typename?: 'Mutation', updateAdmin: { __typename?: 'Admin', id: string } };

export type RemoveAdminMutationVariables = Exact<{
  data: IdInput;
}>;


export type RemoveAdminMutation = { __typename?: 'Mutation', removeAdmin: { __typename?: 'Admin', id: string } };

export type ActivateAdminMutationVariables = Exact<{
  data: IdInput;
}>;


export type ActivateAdminMutation = { __typename?: 'Mutation', activateAdmin: { __typename?: 'Admin', id: string } };

export type DeactivateAdminMutationVariables = Exact<{
  data: IdInput;
}>;


export type DeactivateAdminMutation = { __typename?: 'Mutation', deactivateAdmin: { __typename?: 'Admin', id: string } };


export const AdminLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<AdminLoginMutation, AdminLoginMutationVariables>;
export const MerchantLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MerchantLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MerchantLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchantLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<MerchantLoginMutation, MerchantLoginMutationVariables>;
export const RegisterMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMerchantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<RegisterMerchantMutation, RegisterMerchantMutationVariables>;
export const GetMerchantMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMerchantMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchantMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"webhookSecret"}},{"kind":"Field","name":{"kind":"Name","value":"defaultExpirationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"autoConfirmations"}},{"kind":"Field","name":{"kind":"Name","value":"allowPartialPayments"}},{"kind":"Field","name":{"kind":"Name","value":"collectCustomerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"supportedNetworks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"walletAddress"}}]}}]}}]}}]} as unknown as DocumentNode<GetMerchantMeQuery, GetMerchantMeQueryVariables>;
export const UpdateMerchantProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMerchantProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMerchantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMerchantProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"defaultExpirationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"autoConfirmations"}},{"kind":"Field","name":{"kind":"Name","value":"allowPartialPayments"}},{"kind":"Field","name":{"kind":"Name","value":"collectCustomerEmail"}}]}}]}}]} as unknown as DocumentNode<UpdateMerchantProfileMutation, UpdateMerchantProfileMutationVariables>;
export const AdminUpdateMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminUpdateMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUpdateMerchantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"defaultExpirationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"autoConfirmations"}},{"kind":"Field","name":{"kind":"Name","value":"allowPartialPayments"}},{"kind":"Field","name":{"kind":"Name","value":"collectCustomerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}}]}}]} as unknown as DocumentNode<AdminUpdateMerchantMutation, AdminUpdateMerchantMutationVariables>;
export const GetMerchantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMerchants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetMerchantsQuery, GetMerchantsQueryVariables>;
export const GetMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"webhookSecret"}},{"kind":"Field","name":{"kind":"Name","value":"defaultExpirationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"autoConfirmations"}},{"kind":"Field","name":{"kind":"Name","value":"allowPartialPayments"}},{"kind":"Field","name":{"kind":"Name","value":"collectCustomerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"supportedNetworks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"walletAddress"}}]}}]}}]}}]} as unknown as DocumentNode<GetMerchantQuery, GetMerchantQueryVariables>;
export const ActivateMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activateMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<ActivateMerchantMutation, ActivateMerchantMutationVariables>;
export const DeactivateMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<DeactivateMerchantMutation, DeactivateMerchantMutationVariables>;
export const VerifyMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}}]}}]} as unknown as DocumentNode<VerifyMerchantMutation, VerifyMerchantMutationVariables>;
export const UnverifyMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnverifyMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unverifyMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}}]}}]} as unknown as DocumentNode<UnverifyMerchantMutation, UnverifyMerchantMutationVariables>;
export const DeleteMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteMerchantMutation, DeleteMerchantMutationVariables>;
export const AddMerchantNetworkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMerchantNetwork"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMerchantNetworkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMerchantNetwork"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"walletAddress"}}]}}]}}]} as unknown as DocumentNode<AddMerchantNetworkMutation, AddMerchantNetworkMutationVariables>;
export const UpdateMerchantNetworkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMerchantNetwork"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMerchantNetworkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMerchantNetwork"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"walletAddress"}}]}}]}}]} as unknown as DocumentNode<UpdateMerchantNetworkMutation, UpdateMerchantNetworkMutationVariables>;
export const RemoveMerchantNetworkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMerchantNetwork"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMerchantNetwork"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveMerchantNetworkMutation, RemoveMerchantNetworkMutationVariables>;
export const GetApiKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetApiKeys"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myApiKeys"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"publicKey"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"lastUsedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetApiKeysQuery, GetApiKeysQueryVariables>;
export const CreateApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateApiKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"publicKey"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secretKey"}}]}}]}}]} as unknown as DocumentNode<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const RevokeApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>;
export const GetPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"amountRequested"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"fiatAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fiatCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentAddress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requiredConfirmations"}},{"kind":"Field","name":{"kind":"Name","value":"currentConfirmations"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}},{"kind":"Field","name":{"kind":"Name","value":"successUrl"}},{"kind":"Field","name":{"kind":"Name","value":"cancelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"merchantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"txHash"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"confirmations"}},{"kind":"Field","name":{"kind":"Name","value":"isConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetPaymentQuery, GetPaymentQueryVariables>;
export const GetMyPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyPayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentWhereInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"amountRequested"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"merchantId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetMyPaymentsQuery, GetMyPaymentsQueryVariables>;
export const GetAdminPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminPayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentWhereInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"amountRequested"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"merchantId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetAdminPaymentsQuery, GetAdminPaymentsQueryVariables>;
export const CreatePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"apiKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"apiKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"apiKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentAddress"}},{"kind":"Field","name":{"kind":"Name","value":"amountRequested"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<CreatePaymentMutation, CreatePaymentMutationVariables>;
export const GetPaymentMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentMethods"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"apiKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"apiKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"apiKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"currencies"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>;
export const GetTokenPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokenPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentCurrency"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"priceUSD"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetTokenPriceQuery, GetTokenPriceQueryVariables>;
export const GetAllExchangeRatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllExchangeRates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allExchangeRates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"priceUSD"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAllExchangeRatesQuery, GetAllExchangeRatesQueryVariables>;
export const AdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Admin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AdminQuery, AdminQueryVariables>;
export const AdminsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Admins"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AdminsQuery, AdminsQueryVariables>;
export const CreateAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateAdminMutation, CreateAdminMutationVariables>;
export const UpdateAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateAdminMutation, UpdateAdminMutationVariables>;
export const RemoveAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveAdminMutation, RemoveAdminMutationVariables>;
export const ActivateAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activateAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ActivateAdminMutation, ActivateAdminMutationVariables>;
export const DeactivateAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeactivateAdminMutation, DeactivateAdminMutationVariables>;