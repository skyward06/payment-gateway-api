import { gql } from 'src/__generated__/gql';

export const FETCH_MERCHANTS = gql(/* GraphQL */ `
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
`);

export const FETCH_MERCHANT = gql(/* GraphQL */ `
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
`);

export const ADMIN_UPDATE_MERCHANT = gql(/* GraphQL */ `
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
`);

export const ACTIVATE_MERCHANT = gql(/* GraphQL */ `
  mutation ActivateMerchant($data: IDInput!) {
    activateMerchant(data: $data) {
      id
      isActive
    }
  }
`);

export const DEACTIVATE_MERCHANT = gql(/* GraphQL */ `
  mutation DeactivateMerchant($data: IDInput!) {
    deactivateMerchant(data: $data) {
      id
      isActive
    }
  }
`);

export const VERIFY_MERCHANT = gql(/* GraphQL */ `
  mutation VerifyMerchant($data: IDInput!) {
    verifyMerchant(data: $data) {
      id
      verifiedAt
    }
  }
`);

export const UNVERIFY_MERCHANT = gql(/* GraphQL */ `
  mutation UnverifyMerchant($data: IDInput!) {
    unverifyMerchant(data: $data) {
      id
      verifiedAt
    }
  }
`);

export const DELETE_MERCHANT = gql(/* GraphQL */ `
  mutation DeleteMerchant($data: IDInput!) {
    deleteMerchant(data: $data) {
      id
    }
  }
`);
