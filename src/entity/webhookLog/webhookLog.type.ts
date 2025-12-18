// Webhook payload sent to merchant's webhook URL
export interface WebhookPayload {
  event: string;
  paymentId: string;
  merchantReference: string;
  status: string;
  amount: string;
  currency: string;
  network: string;
  amountReceived?: string;
  paymentAddress: string;
  transactions?: Array<{
    txHash: string;
    amount: string;
    confirmations: number;
  }>;
  timestamp: string;
}
