import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { GET_API_KEYS, CREATE_API_KEY, REVOKE_API_KEY } from 'src/graphql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

export function MerchantApiKeysView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newSecretKey, setNewSecretKey] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery(GET_API_KEYS, {
    variables: {
      take: rowsPerPage,
      skip: page * rowsPerPage,
    },
  });

  const [createApiKey, { loading: creating }] = useMutation(CREATE_API_KEY);
  const [revokeApiKey, { loading: revoking }] = useMutation(REVOKE_API_KEY);

  const apiKeys = data?.myApiKeys?.apiKeys || [];
  const total = data?.myApiKeys?.total || 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateKey = async () => {
    try {
      const response = await createApiKey({
        variables: {
          data: {
            name: newKeyName,
          },
        },
      });

      if (response.data?.createApiKey?.secretKey) {
        setNewSecretKey(response.data.createApiKey.secretKey);
        toast.success('API Key created successfully!');
        refetch();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create API key');
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeApiKey({
        variables: {
          data: { id: keyId },
        },
      });
      toast.success('API Key revoked successfully!');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to revoke API key');
    }
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewKeyName('');
    setNewSecretKey(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4">API Keys</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create New Key
        </Button>
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
                    <TableCell>Public Key</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Used</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" py={4}>
                          No API keys found. Create your first API key to start integrating.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiKeys.map((apiKey: any) => (
                      <TableRow key={apiKey.id} hover>
                        <TableCell>{apiKey.name}</TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {apiKey.publicKey.slice(0, 12)}...
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(apiKey.publicKey)}
                            >
                              <Iconify icon="mdi:content-copy" width={16} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={apiKey.isActive ? 'Active' : 'Revoked'}
                            color={apiKey.isActive ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {apiKey.lastUsedAt ? fDateTime(apiKey.lastUsedAt) : 'Never'}
                        </TableCell>
                        <TableCell>{fDateTime(apiKey.createdAt)}</TableCell>
                        <TableCell align="right">
                          {apiKey.isActive && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRevokeKey(apiKey.id)}
                              disabled={revoking}
                            >
                              <Iconify icon="mdi:delete" />
                            </IconButton>
                          )}
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

      {/* Create API Key Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{newSecretKey ? 'API Key Created' : 'Create New API Key'}</DialogTitle>
        <DialogContent>
          {newSecretKey ? (
            <Stack spacing={2} mt={1}>
              <Alert severity="warning">
                This is the only time you will see the secret key. Please copy and store it
                securely.
              </Alert>
              <TextField
                fullWidth
                label="Secret Key"
                value={newSecretKey}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={() => copyToClipboard(newSecretKey)}>
                      <Iconify icon="mdi:content-copy" />
                    </IconButton>
                  ),
                }}
              />
            </Stack>
          ) : (
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Key Name"
              placeholder="e.g., Production API Key"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          {newSecretKey ? (
            <Button onClick={handleCloseCreateDialog} variant="contained">
              Done
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseCreateDialog}>Cancel</Button>
              <Button
                onClick={handleCreateKey}
                variant="contained"
                disabled={!newKeyName || creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
