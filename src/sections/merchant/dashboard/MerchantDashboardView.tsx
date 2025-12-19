import type { IconifyName } from 'src/components/Iconify';

import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { GET_MY_PAYMENTS } from 'src/graphql';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/Iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type StatCardProps = {
  title: string;
  value: string | number;
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
};

function StatCard({ title, value, icon, color = 'primary' }: StatCardProps) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h3" mt={1}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
          }}
        >
          <Iconify icon={icon as IconifyName} width={32} />
        </Box>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function MerchantDashboardView() {
  const { user } = useAuthContext();

  const { data: totalData, loading: totalLoading } = useQuery(GET_MY_PAYMENTS, {
    variables: { take: 1 },
  });

  const { data: completedData, loading: completedLoading } = useQuery(GET_MY_PAYMENTS, {
    variables: { where: { status: 'COMPLETED' }, take: 1 },
  });

  const { data: pendingData, loading: pendingLoading } = useQuery(GET_MY_PAYMENTS, {
    variables: { where: { status: 'PENDING' }, take: 1 },
  });

  const loading = totalLoading || completedLoading || pendingLoading;

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  const totalPayments = totalData?.myPayments?.total || 0;
  const completedPayments = completedData?.myPayments?.total || 0;
  const pendingPayments = pendingData?.myPayments?.total || 0;

  return (
    <DashboardContent>
      <Typography variant="h4" mb={1}>
        Welcome back, {(user as any)?.name || 'Merchant'}!
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Here&apos;s an overview of your payment activity
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Payments"
            value={totalPayments}
            icon="mdi:credit-card-multiple"
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Completed"
            value={completedPayments}
            icon="mdi:check-circle"
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Pending"
            value={pendingPayments}
            icon="mdi:clock-outline"
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use your API keys to create payment requests programmatically, or check the Payments
              section for details.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
