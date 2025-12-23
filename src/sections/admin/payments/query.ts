import { gql } from 'src/__generated__/gql';

export const FETCH_ADMIN_PAYMENTS = gql(/* GraphQL */ `
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
`);

export const FETCH_PAYMENT = gql(/* GraphQL */ `
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
`);
