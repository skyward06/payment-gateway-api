import type { IconifyName } from 'src/components/Iconify';

import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { GET_PAYMENT } from 'src/graphql';
import { NETWORKS, getTxUrl, CURRENCIES, PAYMENT_STATUS, formatCryptoAmount } from 'src/consts';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

export function PaymentPageView() {
  const { id } = useParams<{ id: string }>();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data, loading, error } = useQuery(GET_PAYMENT, {
    variables: { data: { id } },
    pollInterval: 10000, // Poll every 10 seconds for status updates
    skip: !id,
  });

  const payment = data?.payment;

  // Calculate time left
  useEffect(() => {
    if (!payment?.expiresAt) {
      return () => {};
    }

    const calculateTimeLeft = () => {
      const expires = new Date(payment.expiresAt).getTime();
      const now = Date.now();
      const diff = expires - now;
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [payment?.expiresAt]);

  const formatTimeLeft = (seconds: number): string =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const getStatusConfig = (status: string) =>
    PAYMENT_STATUS[status as keyof typeof PAYMENT_STATUS] || {
      label: status,
      color: 'default',
      icon: 'mdi:help-circle',
    };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !payment) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
        p={3}
      >
        <Iconify icon="mdi:alert-circle" width={64} color="error.main" />
        <Typography variant="h5" mt={2}>
          Payment Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          This payment link may be invalid or expired.
        </Typography>
      </Box>
    );
  }

  const statusConfig = getStatusConfig(payment.status);
  const networkConfig = NETWORKS[payment.network as keyof typeof NETWORKS] || {
    label: payment.network,
  };
  const decimals = CURRENCIES[payment.currency as keyof typeof CURRENCIES]?.decimals || 8;
  const formattedAmount = formatCryptoAmount(payment.amountRequested, decimals);
  const formattedPaid = formatCryptoAmount(payment.amountPaid || '0', decimals);

  const isCompleted = payment.status === 'COMPLETED' || payment.status === 'OVERPAID';
  const isExpired = payment.status === 'EXPIRED';
  const isPending = payment.status === 'PENDING';
  const isDetecting = payment.status === 'DETECTING';
  const isConfirming = payment.status === 'CONFIRMING';

  return (
    <Box
      minHeight="100vh"
      bgcolor="background.default"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <Card sx={{ maxWidth: 520, width: '100%', p: 4 }}>
        {/* Header */}
        <Stack alignItems="center" spacing={1} mb={3}>
          <Typography variant="h5">
            {isCompleted ? 'Payment Complete!' : isExpired ? 'Payment Expired' : 'Payment Request'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={statusConfig.icon as IconifyName} color={`${statusConfig.color}.main`} />
            <Typography variant="body2" color={`${statusConfig.color}.main`}>
              {statusConfig.label}
            </Typography>
          </Stack>
        </Stack>

        {/* Completed State */}
        {isCompleted && (
          <Stack alignItems="center" spacing={2} mb={3}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'success.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="mdi:check" width={48} color="success.main" />
            </Box>
            <Typography variant="body1" color="text.secondary">
              We received your payment. Thank you!
            </Typography>
            {payment.successUrl && (
              <Button variant="contained" href={payment.successUrl} target="_blank">
                Return to Merchant
              </Button>
            )}
          </Stack>
        )}

        {/* Expired State */}
        {isExpired && (
          <Stack alignItems="center" spacing={2} mb={3}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="mdi:clock-alert" width={48} color="error.main" />
            </Box>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              This payment request has expired. Please contact the merchant for a new payment link.
            </Typography>
            {payment.cancelUrl && (
              <Button variant="outlined" href={payment.cancelUrl} target="_blank">
                Return to Merchant
              </Button>
            )}
          </Stack>
        )}

        {/* Active Payment States */}
        {(isPending || isDetecting || isConfirming) && (
          <>
            {/* QR Code */}
            <Stack alignItems="center" mb={3}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 2,
                  display: 'inline-flex',
                }}
              >
                <QRCodeSVG value={payment.paymentAddress} size={180} level="M" />
              </Box>
            </Stack>

            {/* Amount */}
            <Stack alignItems="center" mb={3}>
              <Typography variant="h3" color="primary.main">
                {formattedAmount} {payment.currency}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {networkConfig.label}
                </Typography>
              </Stack>
            </Stack>

            {/* Payment Address */}
            <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Send to Address
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mt={0.5}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    flex: 1,
                    mr: 1,
                  }}
                >
                  {payment.paymentAddress}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(payment.paymentAddress, 'Address')}
                >
                  <Iconify icon="mdi:content-copy" />
                </IconButton>
              </Stack>
            </Card>

            {/* Timer */}
            {isPending && timeLeft > 0 && (
              <Stack alignItems="center" mb={3}>
                <Typography variant="caption" color="text.secondary">
                  Expires in
                </Typography>
                <Typography variant="h6" color={timeLeft < 300 ? 'error.main' : 'text.primary'}>
                  {formatTimeLeft(timeLeft)}
                </Typography>
              </Stack>
            )}

            {/* Confirming Progress */}
            {isConfirming && payment.currentConfirmations !== undefined && (
              <Box mb={3}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Confirmations
                  </Typography>
                  <Typography variant="body2">
                    {payment.currentConfirmations} / {payment.requiredConfirmations}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(payment.currentConfirmations / payment.requiredConfirmations) * 100}
                />
              </Box>
            )}

            {/* Detecting Progress */}
            {isDetecting && (
              <Box mb={3}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Waiting for blockchain confirmation...
                </Typography>
                <LinearProgress sx={{ mt: 1 }} />
              </Box>
            )}
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Payment Details */}
        <Stack spacing={1}>
          {payment.amountPaid && BigInt(payment.amountPaid) > 0 ? (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Amount Paid
              </Typography>
              <Typography variant="body2">
                {formattedPaid} {payment.currency}
              </Typography>
            </Stack>
          ) : null}
          {payment.externalId && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body2">{payment.externalId}</Typography>
            </Stack>
          )}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Payment ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {payment.id.slice(0, 8)}...
            </Typography>
          </Stack>
        </Stack>

        {/* Transactions */}
        {payment.transactions?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" mb={1}>
              Transactions
            </Typography>
            <Stack spacing={1}>
              {payment.transactions.map((tx: any) => (
                <Card key={tx.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {tx.txHash.slice(0, 16)}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tx.confirmations} confirmations
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      component="a"
                      href={getTxUrl(payment.network, tx.txHash)}
                      target="_blank"
                    >
                      <Iconify icon="mdi:open-in-new" />
                    </IconButton>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Card>

      <Typography variant="caption" color="text.secondary" mt={3}>
        Powered by TXC Payment Gateway
      </Typography>
    </Box>
  );
}
