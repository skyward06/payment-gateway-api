import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { GET_MERCHANTS, GET_ADMIN_PAYMENTS, GET_ALL_EXCHANGE_RATES } from 'src/graphql';

import { Iconify } from 'src/components/Iconify';

import { StatCard } from './StatCard';

export function AdminDashboardView() {
  const { data: merchantsData, loading: merchantsLoading } = useQuery(GET_MERCHANTS, {
    variables: { take: 1 },
  });

  const { data: paymentsData, loading: paymentsLoading } = useQuery(GET_ADMIN_PAYMENTS, {
    variables: { take: 1 },
  });

  const { data: exchangeRatesData, loading: exchangeRatesLoading } = useQuery(
    GET_ALL_EXCHANGE_RATES,
    {
      pollInterval: 60000, // Refresh every minute
    }
  );

  const loading = merchantsLoading || paymentsLoading || exchangeRatesLoading;

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  const totalMerchants = merchantsData?.merchants?.total || 0;
  const totalPayments = paymentsData?.adminPayments?.total || 0;
  const exchangeRates = exchangeRatesData?.allExchangeRates;

  return (
    <DashboardContent>
      <Typography variant="h4" mb={4}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Merchants"
            value={totalMerchants}
            icon="mdi:store"
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Payments"
            value={totalPayments}
            icon="mdi:credit-card-outline"
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Today" value={0} icon="mdi:chart-line" color="success" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending" value={0} icon="mdi:clock-outline" color="warning" />
        </Grid>
      </Grid>

      <Card sx={{ mt: 4, p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:currency-usd" width={24} />
            <Typography variant="h6">Exchange Rates (USD)</Typography>
          </Stack>
          {exchangeRates?.updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {fDateTime(exchangeRates.updatedAt)}
            </Typography>
          )}
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Currency</TableCell>
                <TableCell align="right">Price (USD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exchangeRates?.rates?.map((rate: { currency: string; priceUSD: number }) => (
                <TableRow key={rate.currency} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2">{rate.currency}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontFamily="monospace">
                      $
                      {rate.priceUSD.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" mb={2}>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activity to display.
        </Typography>
      </Card>
    </DashboardContent>
  );
}
