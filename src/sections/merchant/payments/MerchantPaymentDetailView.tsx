import type { IconifyName } from 'src/components/Iconify';

import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { fDateTime } from 'src/utils/format-time';

import { GET_PAYMENT } from 'src/graphql';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  NETWORKS,
  getTxUrl,
  CURRENCIES,
  getAddressUrl,
  PAYMENT_STATUS,
  formatUsdAmount,
  formatCryptoAmount,
} from 'src/consts';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

export function MerchantPaymentDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_PAYMENT, {
    variables: { data: { id } },
    skip: !id,
    pollInterval: 30000, // Poll every 30 seconds
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  const payment = data?.payment;

  if (!payment) {
    return (
      <DashboardContent>
        <Typography variant="h5">Payment not found</Typography>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:arrow-left" />}
          onClick={() => navigate(paths.merchant.payments)}
          sx={{ mt: 2 }}
        >
          Back to Payments
        </Button>
      </DashboardContent>
    );
  }

  const statusConfig = PAYMENT_STATUS[payment.status as keyof typeof PAYMENT_STATUS] || {
    label: payment.status,
    color: 'default',
    icon: 'mdi:help-circle',
  };

  const networkConfig = NETWORKS[payment.network as keyof typeof NETWORKS] || {
    label: payment.network,
  };

  const decimals = CURRENCIES[payment.currency as keyof typeof CURRENCIES]?.decimals || 8;
  const formattedAmount = formatCryptoAmount(payment.amountRequested, decimals);
  const formattedPaid = formatCryptoAmount(payment.amountPaid || '0', decimals);

  const paymentPageUrl = `${window.location.origin}/pay/${payment.id}`;

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:arrow-left" />}
            onClick={() => navigate(paths.merchant.payments)}
          >
            Back
          </Button>
          <Typography variant="h4">Payment Details</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:open-in-new" />}
            onClick={() => window.open(paymentPageUrl, '_blank')}
          >
            View Payment Page
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Status Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${statusConfig.color}.lighter`,
                    color: `${statusConfig.color}.main`,
                  }}
                >
                  <Iconify icon={statusConfig.icon as IconifyName} width={32} />
                </Box>
                <Typography variant="h6">{statusConfig.label}</Typography>
                <Divider sx={{ width: '100%' }} />
                <Box textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    Amount Requested
                  </Typography>
                  <Typography variant="h4">
                    {formattedAmount} {payment.currency}
                  </Typography>
                </Box>
                {payment.amountPaid && payment.amountPaid !== '0' && (
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Amount Paid
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {formattedPaid} {payment.currency}
                    </Typography>
                  </Box>
                )}
                {payment.fiatAmount && (
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Fiat Value
                    </Typography>
                    <Typography variant="body1">
                      {formatUsdAmount(payment.fiatAmount)} {payment.fiatCurrency}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment ID
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {payment.id}
                    </Typography>
                    <IconButton size="small" onClick={() => copyToClipboard(payment.id, 'ID')}>
                      <Iconify icon="mdi:content-copy" width={16} />
                    </IconButton>
                  </Stack>
                </Grid>

                {payment.externalId && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      External ID
                    </Typography>
                    <Typography variant="body1">{payment.externalId}</Typography>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Network
                  </Typography>
                  <Chip size="small" label={networkConfig.label} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Currency
                  </Typography>
                  <Typography variant="body1">{payment.currency}</Typography>
                </Grid>

                <Grid size={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Address
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                      component="a"
                      href={getAddressUrl(payment.network, payment.paymentAddress)}
                      target="_blank"
                      rel="noopener"
                    >
                      {payment.paymentAddress}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(payment.paymentAddress, 'Address')}
                    >
                      <Iconify icon="mdi:content-copy" width={16} />
                    </IconButton>
                  </Stack>
                </Grid>

                <Grid size={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Page URL
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                      component="a"
                      href={paymentPageUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      {paymentPageUrl}
                    </Typography>
                    <IconButton size="small" onClick={() => copyToClipboard(paymentPageUrl, 'URL')}>
                      <Iconify icon="mdi:content-copy" width={16} />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Info */}
        {(payment.customerEmail || payment.customerName) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  {payment.customerName && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{payment.customerName}</Typography>
                    </Box>
                  )}
                  {payment.customerEmail && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{payment.customerEmail}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Timestamps */}
        <Grid size={{ xs: 12, md: payment.customerEmail || payment.customerName ? 6 : 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">{fDateTime(payment.createdAt)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expires
                  </Typography>
                  <Typography variant="body2">{fDateTime(payment.expiresAt)}</Typography>
                </Grid>

                {payment.detectedAt && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Detected
                    </Typography>
                    <Typography variant="body2">{fDateTime(payment.detectedAt)}</Typography>
                  </Grid>
                )}

                {payment.confirmedAt && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Confirmed
                    </Typography>
                    <Typography variant="body2">{fDateTime(payment.confirmedAt)}</Typography>
                  </Grid>
                )}

                {payment.completedAt && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="body2">{fDateTime(payment.completedAt)}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions */}
        {payment.transactions && payment.transactions.length > 0 && (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transactions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  {payment.transactions.map((tx: any) => (
                    <Card key={tx.id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          spacing={2}
                        >
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="subtitle2">TX Hash:</Typography>
                              <Typography
                                variant="body2"
                                component="a"
                                href={getTxUrl(payment.network, tx.txHash)}
                                target="_blank"
                                rel="noopener"
                                sx={{
                                  fontFamily: 'monospace',
                                  maxWidth: 300,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {tx.txHash}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(tx.txHash, 'TX Hash')}
                              >
                                <Iconify icon="mdi:content-copy" width={16} />
                              </IconButton>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {fDateTime(tx.createdAt)}
                            </Typography>
                          </Box>

                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box textAlign="right">
                              <Typography variant="subtitle1">
                                {formatCryptoAmount(tx.amount, decimals)} {payment.currency}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {tx.confirmations} confirmations
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={tx.isConfirmed ? 'Confirmed' : 'Pending'}
                              color={tx.isConfirmed ? 'success' : 'warning'}
                            />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  );
}
