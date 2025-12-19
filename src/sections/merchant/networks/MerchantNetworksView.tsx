import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  GET_MERCHANT_ME,
  ADD_MERCHANT_NETWORK,
  UPDATE_MERCHANT_NETWORK,
  REMOVE_MERCHANT_NETWORK,
} from 'src/graphql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

// ----------------------------------------------------------------------

const AVAILABLE_NETWORKS = [
  { network: 'TXC', currency: 'TXC', name: 'Texitcoin', description: 'Native TXC blockchain' },
];

const AddNetworkSchema = zod.object({
  walletAddress: zod.string().min(1, { message: 'Wallet address is required!' }),
});

type AddNetworkSchemaType = zod.infer<typeof AddNetworkSchema>;

const EditNetworkSchema = zod.object({
  walletAddress: zod.string().min(1, { message: 'Wallet address is required!' }),
});

type EditNetworkSchemaType = zod.infer<typeof EditNetworkSchema>;

// ----------------------------------------------------------------------

export function MerchantNetworksView() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);

  const { data, loading, refetch } = useQuery(GET_MERCHANT_ME);

  const [addNetwork, { loading: adding }] = useMutation(ADD_MERCHANT_NETWORK, {
    onCompleted: () => {
      toast.success('Network added successfully');
      setAddDialogOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateNetwork, { loading: updating }] = useMutation(UPDATE_MERCHANT_NETWORK, {
    onCompleted: () => {
      toast.success('Network updated successfully');
      setEditDialogOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [removeNetwork, { loading: removing }] = useMutation(REMOVE_MERCHANT_NETWORK, {
    onCompleted: () => {
      toast.success('Network removed');
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const addMethods = useForm<AddNetworkSchemaType>({
    resolver: zodResolver(AddNetworkSchema),
    defaultValues: {
      walletAddress: '',
    },
  });

  const editMethods = useForm<EditNetworkSchemaType>({
    resolver: zodResolver(EditNetworkSchema),
    defaultValues: {
      walletAddress: '',
    },
  });

  const supportedNetworks = data?.merchantMe?.supportedNetworks || [];

  // Check which networks are already configured
  const configuredNetworkKeys = supportedNetworks.map((n: any) => `${n.network}-${n.currency}`);
  const availableToAdd = AVAILABLE_NETWORKS.filter(
    (n) => !configuredNetworkKeys.includes(`${n.network}-${n.currency}`)
  );

  const handleAddNetwork = addMethods.handleSubmit(async (formData) => {
    const networkToAdd = AVAILABLE_NETWORKS[0]; // TXC only for now
    await addNetwork({
      variables: {
        data: {
          network: networkToAdd.network,
          currency: networkToAdd.currency,
          walletAddress: formData.walletAddress,
        },
      },
    });
    addMethods.reset();
  });

  const handleEditNetwork = editMethods.handleSubmit(async (formData) => {
    if (!selectedNetwork) return;
    await updateNetwork({
      variables: {
        data: {
          id: selectedNetwork.id,
          walletAddress: formData.walletAddress,
        },
      },
    });
  });

  const handleToggleActive = async (network: any) => {
    await updateNetwork({
      variables: {
        data: {
          id: network.id,
          isActive: !network.isActive,
        },
      },
    });
  };

  const handleRemoveNetwork = async (network: any) => {
    if (window.confirm(`Are you sure you want to remove ${network.network} network?`)) {
      await removeNetwork({
        variables: {
          data: { id: network.id },
        },
      });
    }
  };

  const openEditDialog = (network: any) => {
    setSelectedNetwork(network);
    editMethods.reset({ walletAddress: network.walletAddress });
    setEditDialogOpen(true);
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

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4">Payment Networks</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Configure your wallet addresses to receive payments
          </Typography>
        </Box>

        {availableToAdd.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Network
          </Button>
        )}
      </Stack>

      {supportedNetworks.length === 0 ? (
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={2} py={4}>
              <Iconify icon="mdi:wallet-outline" width={64} sx={{ color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                No networks configured
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Add a payment network to start receiving crypto payments
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:plus" />}
                onClick={() => setAddDialogOpen(true)}
              >
                Add TXC Network
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {supportedNetworks.map((network: any) => (
            <Card key={network.id}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                      }}
                    >
                      <Iconify icon="mdi:bitcoin" width={28} />
                    </Box>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1">
                          {network.network} ({network.currency})
                        </Typography>
                        <Chip
                          size="small"
                          label={network.isActive ? 'Active' : 'Inactive'}
                          color={network.isActive ? 'success' : 'default'}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {network.walletAddress}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={network.isActive}
                          onChange={() => handleToggleActive(network)}
                          disabled={updating}
                        />
                      }
                      label=""
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Iconify icon="mdi:pencil" />}
                      onClick={() => openEditDialog(network)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Iconify icon="mdi:delete" />}
                      onClick={() => handleRemoveNetwork(network)}
                      disabled={removing}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Add Network Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add TXC Network</DialogTitle>
        <Form methods={addMethods} onSubmit={handleAddNetwork}>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Enter your TXC wallet address where you want to receive payments.
              </Typography>
              <Field.Text
                name="walletAddress"
                label="TXC Wallet Address"
                placeholder="Enter your TXC wallet address"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={adding}>
              {adding ? 'Adding...' : 'Add Network'}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      {/* Edit Network Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit {selectedNetwork?.network} Network</DialogTitle>
        <Form methods={editMethods} onSubmit={handleEditNetwork}>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Update your wallet address for receiving payments.
              </Typography>
              <Field.Text
                name="walletAddress"
                label="Wallet Address"
                placeholder="Enter your wallet address"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </DashboardContent>
  );
}
