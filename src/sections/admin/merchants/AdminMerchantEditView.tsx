import type { Resolver } from 'react-hook-form';

import { z as zod } from 'zod';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

import {
  useFetchMerchant,
  useDeleteMerchant,
  useVerifyMerchant,
  useActivateMerchant,
  useUnverifyMerchant,
  useDeactivateMerchant,
  useAdminUpdateMerchant,
} from './useApollo';

// ----------------------------------------------------------------------

const MerchantEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Business name is required!' }),
  website: zod.string().url({ message: 'Must be a valid URL!' }).optional().or(zod.literal('')),
  webhookUrl: zod.string().url({ message: 'Must be a valid URL!' }).optional().or(zod.literal('')),
  description: zod.string().optional(),
  defaultExpirationMinutes: zod.coerce.number().min(1).max(1440).optional(),
  autoConfirmations: zod.coerce.number().min(1).max(10).optional(),
  allowPartialPayments: zod.boolean().optional(),
  collectCustomerEmail: zod.boolean().optional(),
});

type MerchantEditSchemaType = zod.infer<typeof MerchantEditSchema>;

// ----------------------------------------------------------------------

export function AdminMerchantEditView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('details');

  const { merchant } = useFetchMerchant(id!);
  const { updateMerchant, loading: updating } = useAdminUpdateMerchant();
  const { activateMerchant, loading: activating } = useActivateMerchant();
  const { deactivateMerchant, loading: deactivating } = useDeactivateMerchant();
  const { verifyMerchant, loading: verifying } = useVerifyMerchant();
  const { unverifyMerchant, loading: unverifying } = useUnverifyMerchant();
  const { deleteMerchant, loading: deleting } = useDeleteMerchant();

  const methods = useForm<MerchantEditSchemaType>({
    resolver: zodResolver(MerchantEditSchema) as Resolver<MerchantEditSchemaType>,
    defaultValues: {
      name: '',
      website: '',
      webhookUrl: '',
      description: '',
      defaultExpirationMinutes: 60,
      autoConfirmations: 1,
      allowPartialPayments: false,
      collectCustomerEmail: false,
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;

  // Reset form when merchant data changes
  useEffect(() => {
    if (merchant) {
      reset({
        name: merchant.name || '',
        website: merchant.website || '',
        webhookUrl: merchant.webhookUrl || '',
        description: merchant.description || '',
        defaultExpirationMinutes: merchant.defaultExpirationMinutes || 60,
        autoConfirmations: merchant.autoConfirmations || 1,
        allowPartialPayments: merchant.allowPartialPayments || false,
        collectCustomerEmail: merchant.collectCustomerEmail || false,
      });
    }
  }, [merchant, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    if (!merchant) return;
    try {
      await updateMerchant({
        id: merchant.id,
        name: formData.name,
        website: formData.website || undefined,
        webhookUrl: formData.webhookUrl || undefined,
        description: formData.description || undefined,
        defaultExpirationMinutes: formData.defaultExpirationMinutes,
        autoConfirmations: formData.autoConfirmations,
        allowPartialPayments: formData.allowPartialPayments,
        collectCustomerEmail: formData.collectCustomerEmail,
      });
      toast.success('Merchant updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  const handleActivate = async () => {
    if (!merchant) return;
    try {
      await activateMerchant(merchant.id);
      toast.success('Merchant activated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeactivate = async () => {
    if (!merchant) return;
    try {
      await deactivateMerchant(merchant.id);
      toast.success('Merchant deactivated');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleVerify = async () => {
    if (!merchant) return;
    try {
      await verifyMerchant(merchant.id);
      toast.success('Merchant verified successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnverify = async () => {
    if (!merchant) return;
    try {
      await unverifyMerchant(merchant.id);
      toast.success('Merchant verification removed');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (
      merchant &&
      window.confirm('Are you sure you want to delete this merchant? This action cannot be undone.')
    ) {
      try {
        await deleteMerchant(merchant.id);
        toast.success('Merchant deleted');
        router.push(paths.admin.merchants.root);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const TABS = [
    { value: 'details', label: 'Details', icon: <Iconify icon="mdi:account" /> },
    { value: 'settings', label: 'Settings', icon: <Iconify icon="mdi:cog" /> },
    { value: 'networks', label: 'Networks', icon: <Iconify icon="mdi:network" /> },
  ];

  // Suspense handles loading for useFetchMerchant

  if (!merchant) {
    return (
      <DashboardContent>
        <Typography variant="h5">Merchant not found</Typography>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:arrow-left" />}
          onClick={() => router.push(paths.admin.merchants.root)}
          sx={{ mt: 2 }}
        >
          Back to Merchants
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:arrow-left" />}
            onClick={() => router.push(paths.admin.merchants.root)}
          >
            Back
          </Button>
          <Typography variant="h4">Edit Merchant</Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={merchant.isActive ? 'Active' : 'Inactive'}
              color={merchant.isActive ? 'success' : 'default'}
            />
            {merchant.verifiedAt && <Chip size="small" label="Verified" color="info" />}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          {merchant.verifiedAt ? (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Iconify icon="mdi:shield-off" />}
              onClick={handleUnverify}
              disabled={unverifying}
            >
              Unverify
            </Button>
          ) : (
            <Button
              variant="contained"
              color="info"
              startIcon={<Iconify icon="mdi:shield-check" />}
              onClick={handleVerify}
              disabled={verifying}
            >
              Verify
            </Button>
          )}
          {merchant.isActive ? (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Iconify icon="mdi:pause" />}
              onClick={handleDeactivate}
              disabled={deactivating}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mdi:check" />}
              onClick={handleActivate}
              disabled={activating}
            >
              Activate
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<Iconify icon="mdi:delete" />}
            onClick={handleDelete}
            disabled={deleting}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Tabs
        value={currentTab}
        onChange={(_, value) => setCurrentTab(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {currentTab === 'details' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={3}>
                Business Information
              </Typography>

              <Form methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                  <Field.Text
                    name="name"
                    label="Business Name"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Email: {merchant.email} (cannot be changed)
                  </Typography>

                  <Field.Text
                    name="website"
                    label="Website"
                    placeholder="https://yourwebsite.com"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Field.Text
                    name="webhookUrl"
                    label="Webhook URL"
                    placeholder="https://yourwebsite.com/webhook"
                    helperText="Payment status updates will be sent to this URL"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Field.Text
                    name="description"
                    label="Business Description"
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: true }}
                  />

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={updating}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Save Changes
                  </LoadingButton>
                </Stack>
              </Form>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Timestamps
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">{fDateTime(merchant.createdAt)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Verified At
                  </Typography>
                  <Typography variant="body2">
                    {merchant.verifiedAt ? fDateTime(merchant.verifiedAt) : '-'}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" mb={2}>
                Webhook Secret
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {merchant.webhookSecret
                    ? `${merchant.webhookSecret.slice(0, 8)}${'•'.repeat(32)}${merchant.webhookSecret.slice(-8)}`
                    : 'Not generated'}
                </Box>
                {merchant.webhookSecret && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(merchant.webhookSecret || '');
                      toast.success('Copied to clipboard');
                    }}
                  >
                    <Iconify icon="mdi:content-copy" width={18} />
                  </IconButton>
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Used to verify webhook payloads. Keep this secret secure.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 'settings' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={3}>
                Payment Settings
              </Typography>

              <Form methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                  <Field.Text
                    name="defaultExpirationMinutes"
                    label="Payment Expiration (minutes)"
                    type="number"
                    helperText="How long before a payment expires (1-1440 minutes)"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Field.Text
                    name="autoConfirmations"
                    label="Required Confirmations"
                    type="number"
                    helperText="Number of blockchain confirmations required (1-10)"
                    InputLabelProps={{ shrink: true }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={watch('allowPartialPayments') || false}
                        onChange={(e) => setValue('allowPartialPayments', e.target.checked)}
                      />
                    }
                    label="Allow Partial Payments"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={watch('collectCustomerEmail') || false}
                        onChange={(e) => setValue('collectCustomerEmail', e.target.checked)}
                      />
                    }
                    label="Collect Customer Email"
                  />

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={updating}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Save Settings
                  </LoadingButton>
                </Stack>
              </Form>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Current Settings
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Payment Expiration
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchant.defaultExpirationMinutes || 60} minutes
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Required Confirmations
                  </Typography>
                  <Typography variant="subtitle2">{merchant.autoConfirmations || 1}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Partial Payments
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={merchant.allowPartialPayments ? 'success.main' : 'text.secondary'}
                  >
                    {merchant.allowPartialPayments ? 'Allowed' : 'Not Allowed'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Collect Customer Email
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={merchant.collectCustomerEmail ? 'success.main' : 'text.secondary'}
                  >
                    {merchant.collectCustomerEmail ? 'Yes' : 'No'}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 'networks' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Supported Networks
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {merchant.supportedNetworks?.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No networks configured by this merchant
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {merchant.supportedNetworks?.map((network: any) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={network.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mt: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordBreak: 'break-all',
                          }}
                        >
                          {network.walletAddress}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardContent>
  );
}
