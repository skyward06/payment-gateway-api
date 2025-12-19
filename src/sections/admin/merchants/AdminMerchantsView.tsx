import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { GET_MERCHANTS } from 'src/graphql';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

export function AdminMerchantsView() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading } = useQuery(GET_MERCHANTS, {
    variables: {
      take: rowsPerPage,
      skip: page * rowsPerPage,
    },
  });

  const merchants = data?.merchants?.merchants || [];
  const total = data?.merchants?.total || 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Merchants</Typography>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Website</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {merchants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary" py={4}>
                          No merchants found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    merchants.map((merchant: any) => (
                      <TableRow key={merchant.id} hover>
                        <TableCell>{merchant.name}</TableCell>
                        <TableCell>{merchant.email}</TableCell>
                        <TableCell>{merchant.website || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={merchant.isActive ? 'Active' : 'Inactive'}
                            color={merchant.isActive ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {merchant.verifiedAt ? (
                            <Chip size="small" label="Verified" color="info" />
                          ) : (
                            <Chip size="small" label="Unverified" color="warning" />
                          )}
                        </TableCell>
                        <TableCell>{fDateTime(merchant.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Iconify icon="mdi:eye" />}
                            onClick={() => navigate(`/admin/merchants/${merchant.id}`)}
                          >
                            View
                          </Button>
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
