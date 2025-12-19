import { useState } from 'react';
import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { GET_MY_PAYMENTS } from 'src/graphql';
import { DashboardContent } from 'src/layouts/dashboard';
import { CURRENCIES, PAYMENT_STATUS, formatCryptoAmount } from 'src/consts';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

export function MerchantPaymentsView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading } = useQuery(GET_MY_PAYMENTS, {
    variables: {
      take: rowsPerPage,
      skip: page * rowsPerPage,
    },
  });

  const payments = data?.myPayments?.payments || [];
  const total = data?.myPayments?.total || 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = PAYMENT_STATUS[status as keyof typeof PAYMENT_STATUS] || {
      label: status,
      color: 'default',
    };
    return <Chip size="small" label={statusConfig.label} color={statusConfig.color as any} />;
  };

  const formatAmount = (amount: string, currency: string) => {
    const decimals = CURRENCIES[currency as keyof typeof CURRENCIES]?.decimals || 8;
    return `${formatCryptoAmount(amount, decimals)} ${currency}`;
  };

  const handleViewDetails = (paymentId: string) => {
    router.push(paths.merchant.paymentDetail(paymentId));
  };

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Payments</Typography>
      </Stack>

      <Card>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>External ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Network</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary" py={4}>
                          No payments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment: any) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {payment.id.slice(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{payment.externalId || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          {formatAmount(payment.amountRequested, payment.currency)}
                        </TableCell>
                        <TableCell>{payment.network}</TableCell>
                        <TableCell>{getStatusChip(payment.status)}</TableCell>
                        <TableCell>{fDateTime(payment.expiresAt)}</TableCell>
                        <TableCell>{fDateTime(payment.createdAt)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleViewDetails(payment.id)}>
                            <Iconify icon="mdi:eye" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}
