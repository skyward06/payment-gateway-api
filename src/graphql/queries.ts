import { gql } from '@apollo/client';

// ==================== ADMIN ====================

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($data: AdminLoginInput!) {
    adminLogin(data: $data) {
      admin {
        id
        email
        name
        role
        isActive
        createdAt
      }
      token
    }
  }
`;

// ==================== MERCHANT ====================

export const MERCHANT_LOGIN = gql`
  mutation MerchantLogin($data: MerchantLoginInput!) {
    merchantLogin(data: $data) {
      merchant {
        id
        name
        email
        website
        logoUrl
        isActive
        createdAt
      }
      token
    }
  }
`;

export const MERCHANT_REGISTER = gql`
  mutation RegisterMerchant($data: CreateMerchantInput!) {
    registerMerchant(data: $data) {
      id
      name
      email
    }
  }
`;

export const GET_MERCHANT_ME = gql`
  query GetMerchantMe {
    merchantMe {
      id
      name
      email
      website
      logoUrl
      description
      webhookUrl
      webhookSecret
      defaultExpirationMinutes
      autoConfirmations
      allowPartialPayments
      collectCustomerEmail
      isActive
      verifiedAt
      createdAt
      supportedNetworks {
        id
        network
        currency
        isActive
        walletAddress
      }
    }
  }
`;

export const UPDATE_MERCHANT_PROFILE = gql`
  mutation UpdateMerchantProfile($data: UpdateMerchantInput!) {
    updateMerchantProfile(data: $data) {
      id
      name
      email
      website
      webhookUrl
      description
      defaultExpirationMinutes
      autoConfirmations
      allowPartialPayments
      collectCustomerEmail
    }
  }
`;

export const ADMIN_UPDATE_MERCHANT = gql`
  mutation AdminUpdateMerchant($data: AdminUpdateMerchantInput!) {
    adminUpdateMerchant(data: $data) {
      id
      name
      email
      website
      webhookUrl
      description
      defaultExpirationMinutes
      autoConfirmations
      allowPartialPayments
      collectCustomerEmail
      isActive
      verifiedAt
    }
  }
`;

export const GET_MERCHANTS = gql`
  query GetMerchants($search: String, $isActive: Boolean, $take: Int, $skip: Int) {
    merchants(search: $search, isActive: $isActive, take: $take, skip: $skip) {
      merchants {
        id
        name
        email
        website
        isActive
        verifiedAt
        createdAt
      }
      total
    }
  }
`;

export const GET_MERCHANT = gql`
  query GetMerchant($data: IDInput!) {
    merchant(data: $data) {
      id
      name
      email
      website
      logoUrl
      description
      webhookUrl
      webhookSecret
      defaultExpirationMinutes
      autoConfirmations
      allowPartialPayments
      collectCustomerEmail
      isActive
      verifiedAt
      createdAt
      supportedNetworks {
        id
        network
        currency
        isActive
        walletAddress
      }
    }
  }
`;

export const ACTIVATE_MERCHANT = gql`
  mutation ActivateMerchant($data: IDInput!) {
    activateMerchant(data: $data) {
      id
      isActive
    }
  }
`;

export const DEACTIVATE_MERCHANT = gql`
  mutation DeactivateMerchant($data: IDInput!) {
    deactivateMerchant(data: $data) {
      id
      isActive
    }
  }
`;

export const VERIFY_MERCHANT = gql`
  mutation VerifyMerchant($data: IDInput!) {
    verifyMerchant(data: $data) {
      id
      verifiedAt
    }
  }
`;

export const UNVERIFY_MERCHANT = gql`
  mutation UnverifyMerchant($data: IDInput!) {
    unverifyMerchant(data: $data) {
      id
      verifiedAt
    }
  }
`;

export const DELETE_MERCHANT = gql`
  mutation DeleteMerchant($data: IDInput!) {
    deleteMerchant(data: $data) {
      id
    }
  }
`;

export const ADD_MERCHANT_NETWORK = gql`
  mutation AddMerchantNetwork($data: AddMerchantNetworkInput!) {
    addMerchantNetwork(data: $data) {
      id
      network
      currency
      isActive
      walletAddress
    }
  }
`;

export const UPDATE_MERCHANT_NETWORK = gql`
  mutation UpdateMerchantNetwork($data: UpdateMerchantNetworkInput!) {
    updateMerchantNetwork(data: $data) {
      id
      network
      currency
      isActive
      walletAddress
    }
  }
`;

export const REMOVE_MERCHANT_NETWORK = gql`
  mutation RemoveMerchantNetwork($data: IDInput!) {
    removeMerchantNetwork(data: $data) {
      id
    }
  }
`;

// ==================== API KEYS ====================

export const GET_API_KEYS = gql`
  query GetApiKeys($isActive: Boolean, $take: Int, $skip: Int) {
    myApiKeys(isActive: $isActive, take: $take, skip: $skip) {
      apiKeys {
        id
        name
        publicKey
        description
        permissions
        isActive
        lastUsedAt
        expiresAt
        createdAt
      }
      total
    }
  }
`;

export const CREATE_API_KEY = gql`
  mutation CreateApiKey($data: CreateApiKeyInput!) {
    createApiKey(data: $data) {
      apiKey {
        id
        name
        publicKey
        isActive
      }
      secretKey
    }
  }
`;

export const REVOKE_API_KEY = gql`
  mutation RevokeApiKey($data: IDInput!) {
    revokeApiKey(data: $data) {
      id
      isActive
    }
  }
`;

// ==================== PAYMENTS ====================

export const GET_PAYMENT = gql`
  query GetPayment($data: IDInput!) {
    payment(data: $data) {
      id
      externalId
      amountRequested
      amountPaid
      fiatAmount
      fiatCurrency
      network
      currency
      paymentAddress
      status
      requiredConfirmations
      currentConfirmations
      expiresAt
      detectedAt
      confirmedAt
      completedAt
      customerEmail
      customerName
      successUrl
      cancelUrl
      merchantId
      createdAt
      transactions {
        id
        txHash
        amount
        confirmations
        isConfirmed
        createdAt
      }
    }
  }
`;

// Merchant authenticated - get own payments
export const GET_MY_PAYMENTS = gql`
  query GetMyPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {
    myPayments(where: $where, take: $take, skip: $skip) {
      payments {
        id
        externalId
        amountRequested
        amountPaid
        network
        currency
        status
        expiresAt
        createdAt
        merchantId
      }
      total
    }
  }
`;

// Admin only - get all payments
export const GET_ADMIN_PAYMENTS = gql`
  query GetAdminPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {
    adminPayments(where: $where, take: $take, skip: $skip) {
      payments {
        id
        externalId
        amountRequested
        amountPaid
        network
        currency
        status
        expiresAt
        createdAt
        merchantId
      }
      total
    }
  }
`;

// API Key authenticated - create payment (for external integrations)
export const CREATE_PAYMENT = gql`
  mutation CreatePayment($apiKey: String!, $data: CreatePaymentInput!) {
    createPayment(apiKey: $apiKey, data: $data) {
      id
      paymentAddress
      amountRequested
      network
      currency
      status
      expiresAt
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods($apiKey: String) {
    paymentMethods(apiKey: $apiKey) {
      network
      currencies
      enabled
    }
  }
`;

export const GET_TOKEN_PRICE = gql`
  query GetTokenPrice($currency: PaymentCurrency!) {
    tokenPrice(currency: $currency) {
      currency
      priceUSD
      updatedAt
    }
  }
`;

export const GET_ALL_EXCHANGE_RATES = gql`
  query GetAllExchangeRates {
    allExchangeRates {
      rates {
        currency
        priceUSD
      }
      updatedAt
    }
  }
`;
