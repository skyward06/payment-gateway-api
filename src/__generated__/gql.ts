/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation AdminLogin($data: AdminLoginInput!) {\n    adminLogin(data: $data) {\n      admin {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n": typeof types.AdminLoginDocument,
    "\n  mutation MerchantLogin($data: MerchantLoginInput!) {\n    merchantLogin(data: $data) {\n      merchant {\n        id\n        name\n        email\n        website\n        logoUrl\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n": typeof types.MerchantLoginDocument,
    "\n  mutation RegisterMerchant($data: CreateMerchantInput!) {\n    registerMerchant(data: $data) {\n      id\n      name\n      email\n    }\n  }\n": typeof types.RegisterMerchantDocument,
    "\n  query GetMerchantMe {\n    merchantMe {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n": typeof types.GetMerchantMeDocument,
    "\n  mutation UpdateMerchantProfile($data: UpdateMerchantInput!) {\n    updateMerchantProfile(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n    }\n  }\n": typeof types.UpdateMerchantProfileDocument,
    "\n  mutation AdminUpdateMerchant($data: AdminUpdateMerchantInput!) {\n    adminUpdateMerchant(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n    }\n  }\n": typeof types.AdminUpdateMerchantDocument,
    "\n  query GetMerchants($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    merchants(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      merchants {\n        id\n        name\n        email\n        website\n        isActive\n        verifiedAt\n        createdAt\n      }\n      total\n    }\n  }\n": typeof types.GetMerchantsDocument,
    "\n  query GetMerchant($data: IDInput!) {\n    merchant(data: $data) {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n": typeof types.GetMerchantDocument,
    "\n  mutation ActivateMerchant($data: IDInput!) {\n    activateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n": typeof types.ActivateMerchantDocument,
    "\n  mutation DeactivateMerchant($data: IDInput!) {\n    deactivateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n": typeof types.DeactivateMerchantDocument,
    "\n  mutation VerifyMerchant($data: IDInput!) {\n    verifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n": typeof types.VerifyMerchantDocument,
    "\n  mutation UnverifyMerchant($data: IDInput!) {\n    unverifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n": typeof types.UnverifyMerchantDocument,
    "\n  mutation DeleteMerchant($data: IDInput!) {\n    deleteMerchant(data: $data) {\n      id\n    }\n  }\n": typeof types.DeleteMerchantDocument,
    "\n  mutation AddMerchantNetwork($data: AddMerchantNetworkInput!) {\n    addMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n": typeof types.AddMerchantNetworkDocument,
    "\n  mutation UpdateMerchantNetwork($data: UpdateMerchantNetworkInput!) {\n    updateMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n": typeof types.UpdateMerchantNetworkDocument,
    "\n  mutation RemoveMerchantNetwork($data: IDInput!) {\n    removeMerchantNetwork(data: $data) {\n      id\n    }\n  }\n": typeof types.RemoveMerchantNetworkDocument,
    "\n  query GetApiKeys($isActive: Boolean, $take: Int, $skip: Int) {\n    myApiKeys(isActive: $isActive, take: $take, skip: $skip) {\n      apiKeys {\n        id\n        name\n        publicKey\n        description\n        permissions\n        isActive\n        lastUsedAt\n        expiresAt\n        createdAt\n      }\n      total\n    }\n  }\n": typeof types.GetApiKeysDocument,
    "\n  mutation CreateApiKey($data: CreateApiKeyInput!) {\n    createApiKey(data: $data) {\n      apiKey {\n        id\n        name\n        publicKey\n        isActive\n      }\n      secretKey\n    }\n  }\n": typeof types.CreateApiKeyDocument,
    "\n  mutation RevokeApiKey($data: IDInput!) {\n    revokeApiKey(data: $data) {\n      id\n      isActive\n    }\n  }\n": typeof types.RevokeApiKeyDocument,
    "\n  query GetPayment($data: IDInput!) {\n    payment(data: $data) {\n      id\n      externalId\n      amountRequested\n      amountPaid\n      fiatAmount\n      fiatCurrency\n      network\n      currency\n      paymentAddress\n      status\n      requiredConfirmations\n      currentConfirmations\n      expiresAt\n      detectedAt\n      confirmedAt\n      completedAt\n      customerEmail\n      customerName\n      successUrl\n      cancelUrl\n      merchantId\n      createdAt\n      transactions {\n        id\n        txHash\n        amount\n        confirmations\n        isConfirmed\n        createdAt\n      }\n    }\n  }\n": typeof types.GetPaymentDocument,
    "\n  query GetMyPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    myPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n": typeof types.GetMyPaymentsDocument,
    "\n  query GetAdminPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    adminPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n": typeof types.GetAdminPaymentsDocument,
    "\n  mutation CreatePayment($apiKey: String!, $data: CreatePaymentInput!) {\n    createPayment(apiKey: $apiKey, data: $data) {\n      id\n      paymentAddress\n      amountRequested\n      network\n      currency\n      status\n      expiresAt\n    }\n  }\n": typeof types.CreatePaymentDocument,
    "\n  query GetPaymentMethods($apiKey: String) {\n    paymentMethods(apiKey: $apiKey) {\n      network\n      currencies\n      enabled\n    }\n  }\n": typeof types.GetPaymentMethodsDocument,
    "\n  query GetTokenPrice($currency: PaymentCurrency!) {\n    tokenPrice(currency: $currency) {\n      currency\n      priceUSD\n      updatedAt\n    }\n  }\n": typeof types.GetTokenPriceDocument,
    "\n  query GetAllExchangeRates {\n    allExchangeRates {\n      rates {\n        currency\n        priceUSD\n      }\n      updatedAt\n    }\n  }\n": typeof types.GetAllExchangeRatesDocument,
    "\n  query GetAdmins($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    admins(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      admins {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      total\n    }\n  }\n": typeof types.GetAdminsDocument,
    "\n  mutation CreateAdmin($data: CreateAdminInput!) {\n    createAdmin(data: $data) {\n      id\n      email\n      name\n      role\n    }\n  }\n": typeof types.CreateAdminDocument,
};
const documents: Documents = {
    "\n  mutation AdminLogin($data: AdminLoginInput!) {\n    adminLogin(data: $data) {\n      admin {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n": types.AdminLoginDocument,
    "\n  mutation MerchantLogin($data: MerchantLoginInput!) {\n    merchantLogin(data: $data) {\n      merchant {\n        id\n        name\n        email\n        website\n        logoUrl\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n": types.MerchantLoginDocument,
    "\n  mutation RegisterMerchant($data: CreateMerchantInput!) {\n    registerMerchant(data: $data) {\n      id\n      name\n      email\n    }\n  }\n": types.RegisterMerchantDocument,
    "\n  query GetMerchantMe {\n    merchantMe {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n": types.GetMerchantMeDocument,
    "\n  mutation UpdateMerchantProfile($data: UpdateMerchantInput!) {\n    updateMerchantProfile(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n    }\n  }\n": types.UpdateMerchantProfileDocument,
    "\n  mutation AdminUpdateMerchant($data: AdminUpdateMerchantInput!) {\n    adminUpdateMerchant(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n    }\n  }\n": types.AdminUpdateMerchantDocument,
    "\n  query GetMerchants($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    merchants(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      merchants {\n        id\n        name\n        email\n        website\n        isActive\n        verifiedAt\n        createdAt\n      }\n      total\n    }\n  }\n": types.GetMerchantsDocument,
    "\n  query GetMerchant($data: IDInput!) {\n    merchant(data: $data) {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n": types.GetMerchantDocument,
    "\n  mutation ActivateMerchant($data: IDInput!) {\n    activateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n": types.ActivateMerchantDocument,
    "\n  mutation DeactivateMerchant($data: IDInput!) {\n    deactivateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n": types.DeactivateMerchantDocument,
    "\n  mutation VerifyMerchant($data: IDInput!) {\n    verifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n": types.VerifyMerchantDocument,
    "\n  mutation UnverifyMerchant($data: IDInput!) {\n    unverifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n": types.UnverifyMerchantDocument,
    "\n  mutation DeleteMerchant($data: IDInput!) {\n    deleteMerchant(data: $data) {\n      id\n    }\n  }\n": types.DeleteMerchantDocument,
    "\n  mutation AddMerchantNetwork($data: AddMerchantNetworkInput!) {\n    addMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n": types.AddMerchantNetworkDocument,
    "\n  mutation UpdateMerchantNetwork($data: UpdateMerchantNetworkInput!) {\n    updateMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n": types.UpdateMerchantNetworkDocument,
    "\n  mutation RemoveMerchantNetwork($data: IDInput!) {\n    removeMerchantNetwork(data: $data) {\n      id\n    }\n  }\n": types.RemoveMerchantNetworkDocument,
    "\n  query GetApiKeys($isActive: Boolean, $take: Int, $skip: Int) {\n    myApiKeys(isActive: $isActive, take: $take, skip: $skip) {\n      apiKeys {\n        id\n        name\n        publicKey\n        description\n        permissions\n        isActive\n        lastUsedAt\n        expiresAt\n        createdAt\n      }\n      total\n    }\n  }\n": types.GetApiKeysDocument,
    "\n  mutation CreateApiKey($data: CreateApiKeyInput!) {\n    createApiKey(data: $data) {\n      apiKey {\n        id\n        name\n        publicKey\n        isActive\n      }\n      secretKey\n    }\n  }\n": types.CreateApiKeyDocument,
    "\n  mutation RevokeApiKey($data: IDInput!) {\n    revokeApiKey(data: $data) {\n      id\n      isActive\n    }\n  }\n": types.RevokeApiKeyDocument,
    "\n  query GetPayment($data: IDInput!) {\n    payment(data: $data) {\n      id\n      externalId\n      amountRequested\n      amountPaid\n      fiatAmount\n      fiatCurrency\n      network\n      currency\n      paymentAddress\n      status\n      requiredConfirmations\n      currentConfirmations\n      expiresAt\n      detectedAt\n      confirmedAt\n      completedAt\n      customerEmail\n      customerName\n      successUrl\n      cancelUrl\n      merchantId\n      createdAt\n      transactions {\n        id\n        txHash\n        amount\n        confirmations\n        isConfirmed\n        createdAt\n      }\n    }\n  }\n": types.GetPaymentDocument,
    "\n  query GetMyPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    myPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n": types.GetMyPaymentsDocument,
    "\n  query GetAdminPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    adminPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n": types.GetAdminPaymentsDocument,
    "\n  mutation CreatePayment($apiKey: String!, $data: CreatePaymentInput!) {\n    createPayment(apiKey: $apiKey, data: $data) {\n      id\n      paymentAddress\n      amountRequested\n      network\n      currency\n      status\n      expiresAt\n    }\n  }\n": types.CreatePaymentDocument,
    "\n  query GetPaymentMethods($apiKey: String) {\n    paymentMethods(apiKey: $apiKey) {\n      network\n      currencies\n      enabled\n    }\n  }\n": types.GetPaymentMethodsDocument,
    "\n  query GetTokenPrice($currency: PaymentCurrency!) {\n    tokenPrice(currency: $currency) {\n      currency\n      priceUSD\n      updatedAt\n    }\n  }\n": types.GetTokenPriceDocument,
    "\n  query GetAllExchangeRates {\n    allExchangeRates {\n      rates {\n        currency\n        priceUSD\n      }\n      updatedAt\n    }\n  }\n": types.GetAllExchangeRatesDocument,
    "\n  query GetAdmins($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    admins(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      admins {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      total\n    }\n  }\n": types.GetAdminsDocument,
    "\n  mutation CreateAdmin($data: CreateAdminInput!) {\n    createAdmin(data: $data) {\n      id\n      email\n      name\n      role\n    }\n  }\n": types.CreateAdminDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AdminLogin($data: AdminLoginInput!) {\n    adminLogin(data: $data) {\n      admin {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation AdminLogin($data: AdminLoginInput!) {\n    adminLogin(data: $data) {\n      admin {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MerchantLogin($data: MerchantLoginInput!) {\n    merchantLogin(data: $data) {\n      merchant {\n        id\n        name\n        email\n        website\n        logoUrl\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation MerchantLogin($data: MerchantLoginInput!) {\n    merchantLogin(data: $data) {\n      merchant {\n        id\n        name\n        email\n        website\n        logoUrl\n        isActive\n        createdAt\n      }\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RegisterMerchant($data: CreateMerchantInput!) {\n    registerMerchant(data: $data) {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterMerchant($data: CreateMerchantInput!) {\n    registerMerchant(data: $data) {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMerchantMe {\n    merchantMe {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMerchantMe {\n    merchantMe {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMerchantProfile($data: UpdateMerchantInput!) {\n    updateMerchantProfile(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMerchantProfile($data: UpdateMerchantInput!) {\n    updateMerchantProfile(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AdminUpdateMerchant($data: AdminUpdateMerchantInput!) {\n    adminUpdateMerchant(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n    }\n  }\n"): (typeof documents)["\n  mutation AdminUpdateMerchant($data: AdminUpdateMerchantInput!) {\n    adminUpdateMerchant(data: $data) {\n      id\n      name\n      email\n      website\n      webhookUrl\n      description\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMerchants($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    merchants(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      merchants {\n        id\n        name\n        email\n        website\n        isActive\n        verifiedAt\n        createdAt\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query GetMerchants($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    merchants(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      merchants {\n        id\n        name\n        email\n        website\n        isActive\n        verifiedAt\n        createdAt\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMerchant($data: IDInput!) {\n    merchant(data: $data) {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMerchant($data: IDInput!) {\n    merchant(data: $data) {\n      id\n      name\n      email\n      website\n      logoUrl\n      description\n      webhookUrl\n      webhookSecret\n      defaultExpirationMinutes\n      autoConfirmations\n      allowPartialPayments\n      collectCustomerEmail\n      isActive\n      verifiedAt\n      createdAt\n      supportedNetworks {\n        id\n        network\n        currency\n        isActive\n        walletAddress\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ActivateMerchant($data: IDInput!) {\n    activateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation ActivateMerchant($data: IDInput!) {\n    activateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeactivateMerchant($data: IDInput!) {\n    deactivateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation DeactivateMerchant($data: IDInput!) {\n    deactivateMerchant(data: $data) {\n      id\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation VerifyMerchant($data: IDInput!) {\n    verifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyMerchant($data: IDInput!) {\n    verifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnverifyMerchant($data: IDInput!) {\n    unverifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UnverifyMerchant($data: IDInput!) {\n    unverifyMerchant(data: $data) {\n      id\n      verifiedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteMerchant($data: IDInput!) {\n    deleteMerchant(data: $data) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMerchant($data: IDInput!) {\n    deleteMerchant(data: $data) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddMerchantNetwork($data: AddMerchantNetworkInput!) {\n    addMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n"): (typeof documents)["\n  mutation AddMerchantNetwork($data: AddMerchantNetworkInput!) {\n    addMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMerchantNetwork($data: UpdateMerchantNetworkInput!) {\n    updateMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMerchantNetwork($data: UpdateMerchantNetworkInput!) {\n    updateMerchantNetwork(data: $data) {\n      id\n      network\n      currency\n      isActive\n      walletAddress\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveMerchantNetwork($data: IDInput!) {\n    removeMerchantNetwork(data: $data) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveMerchantNetwork($data: IDInput!) {\n    removeMerchantNetwork(data: $data) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetApiKeys($isActive: Boolean, $take: Int, $skip: Int) {\n    myApiKeys(isActive: $isActive, take: $take, skip: $skip) {\n      apiKeys {\n        id\n        name\n        publicKey\n        description\n        permissions\n        isActive\n        lastUsedAt\n        expiresAt\n        createdAt\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query GetApiKeys($isActive: Boolean, $take: Int, $skip: Int) {\n    myApiKeys(isActive: $isActive, take: $take, skip: $skip) {\n      apiKeys {\n        id\n        name\n        publicKey\n        description\n        permissions\n        isActive\n        lastUsedAt\n        expiresAt\n        createdAt\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateApiKey($data: CreateApiKeyInput!) {\n    createApiKey(data: $data) {\n      apiKey {\n        id\n        name\n        publicKey\n        isActive\n      }\n      secretKey\n    }\n  }\n"): (typeof documents)["\n  mutation CreateApiKey($data: CreateApiKeyInput!) {\n    createApiKey(data: $data) {\n      apiKey {\n        id\n        name\n        publicKey\n        isActive\n      }\n      secretKey\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RevokeApiKey($data: IDInput!) {\n    revokeApiKey(data: $data) {\n      id\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation RevokeApiKey($data: IDInput!) {\n    revokeApiKey(data: $data) {\n      id\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPayment($data: IDInput!) {\n    payment(data: $data) {\n      id\n      externalId\n      amountRequested\n      amountPaid\n      fiatAmount\n      fiatCurrency\n      network\n      currency\n      paymentAddress\n      status\n      requiredConfirmations\n      currentConfirmations\n      expiresAt\n      detectedAt\n      confirmedAt\n      completedAt\n      customerEmail\n      customerName\n      successUrl\n      cancelUrl\n      merchantId\n      createdAt\n      transactions {\n        id\n        txHash\n        amount\n        confirmations\n        isConfirmed\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPayment($data: IDInput!) {\n    payment(data: $data) {\n      id\n      externalId\n      amountRequested\n      amountPaid\n      fiatAmount\n      fiatCurrency\n      network\n      currency\n      paymentAddress\n      status\n      requiredConfirmations\n      currentConfirmations\n      expiresAt\n      detectedAt\n      confirmedAt\n      completedAt\n      customerEmail\n      customerName\n      successUrl\n      cancelUrl\n      merchantId\n      createdAt\n      transactions {\n        id\n        txHash\n        amount\n        confirmations\n        isConfirmed\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    myPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query GetMyPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    myPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAdminPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    adminPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query GetAdminPayments($where: PaymentWhereInput, $take: Int, $skip: Int) {\n    adminPayments(where: $where, take: $take, skip: $skip) {\n      payments {\n        id\n        externalId\n        amountRequested\n        amountPaid\n        network\n        currency\n        status\n        expiresAt\n        createdAt\n        merchantId\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePayment($apiKey: String!, $data: CreatePaymentInput!) {\n    createPayment(apiKey: $apiKey, data: $data) {\n      id\n      paymentAddress\n      amountRequested\n      network\n      currency\n      status\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePayment($apiKey: String!, $data: CreatePaymentInput!) {\n    createPayment(apiKey: $apiKey, data: $data) {\n      id\n      paymentAddress\n      amountRequested\n      network\n      currency\n      status\n      expiresAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPaymentMethods($apiKey: String) {\n    paymentMethods(apiKey: $apiKey) {\n      network\n      currencies\n      enabled\n    }\n  }\n"): (typeof documents)["\n  query GetPaymentMethods($apiKey: String) {\n    paymentMethods(apiKey: $apiKey) {\n      network\n      currencies\n      enabled\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTokenPrice($currency: PaymentCurrency!) {\n    tokenPrice(currency: $currency) {\n      currency\n      priceUSD\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetTokenPrice($currency: PaymentCurrency!) {\n    tokenPrice(currency: $currency) {\n      currency\n      priceUSD\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllExchangeRates {\n    allExchangeRates {\n      rates {\n        currency\n        priceUSD\n      }\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetAllExchangeRates {\n    allExchangeRates {\n      rates {\n        currency\n        priceUSD\n      }\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAdmins($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    admins(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      admins {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query GetAdmins($search: String, $isActive: Boolean, $take: Int, $skip: Int) {\n    admins(search: $search, isActive: $isActive, take: $take, skip: $skip) {\n      admins {\n        id\n        email\n        name\n        role\n        isActive\n        createdAt\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateAdmin($data: CreateAdminInput!) {\n    createAdmin(data: $data) {\n      id\n      email\n      name\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAdmin($data: CreateAdminInput!) {\n    createAdmin(data: $data) {\n      id\n      email\n      name\n      role\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;