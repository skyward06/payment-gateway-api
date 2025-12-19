import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@apollo/client';
import { useForm, type Resolver } from 'react-hook-form';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { GET_MERCHANT_ME, UPDATE_MERCHANT_PROFILE } from 'src/graphql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

// ----------------------------------------------------------------------

const MerchantSettingsSchema = zod.object({
  name: zod.string().min(1, { message: 'Business name is required!' }),
  email: zod.string().email({ message: 'Valid email is required!' }),
  website: zod.string().url({ message: 'Must be a valid URL!' }).optional().or(zod.literal('')),
  webhookUrl: zod.string().url({ message: 'Must be a valid URL!' }).optional().or(zod.literal('')),
  description: zod.string().optional(),
  defaultExpirationMinutes: zod.coerce.number().min(1).max(1440).optional(),
  autoConfirmations: zod.coerce.number().min(1).max(10).optional(),
  allowPartialPayments: zod.boolean().optional(),
  collectCustomerEmail: zod.boolean().optional(),
});

type MerchantSettingsSchemaType = zod.infer<typeof MerchantSettingsSchema>;

// ----------------------------------------------------------------------

export function MerchantSettingsView() {
  const { data, loading, refetch } = useQuery(GET_MERCHANT_ME);
  const [updateMerchant, { loading: updating }] = useMutation(UPDATE_MERCHANT_PROFILE);
  const [currentTab, setCurrentTab] = useState('business');

  const methods = useForm<MerchantSettingsSchemaType>({
    resolver: zodResolver(MerchantSettingsSchema) as Resolver<MerchantSettingsSchemaType>,
    defaultValues: {
      name: '',
      email: '',
      website: '',
      webhookUrl: '',
      description: '',
      defaultExpirationMinutes: 60,
      autoConfirmations: 1,
      allowPartialPayments: false,
      collectCustomerEmail: false,
    },
  });

  const { reset, handleSubmit, watch, setValue } = methods;

  useEffect(() => {
    if (data?.merchantMe) {
      reset({
        name: data.merchantMe.name || '',
        email: data.merchantMe.email || '',
        website: data.merchantMe.website || '',
        webhookUrl: data.merchantMe.webhookUrl || '',
        description: data.merchantMe.description || '',
        defaultExpirationMinutes: data.merchantMe.defaultExpirationMinutes || 60,
        autoConfirmations: data.merchantMe.autoConfirmations || 1,
        allowPartialPayments: data.merchantMe.allowPartialPayments || false,
        collectCustomerEmail: data.merchantMe.collectCustomerEmail || false,
      });
    }
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await updateMerchant({
        variables: {
          data: {
            name: formData.name,
            website: formData.website || undefined,
            webhookUrl: formData.webhookUrl || undefined,
            description: formData.description || undefined,
            defaultExpirationMinutes: formData.defaultExpirationMinutes,
            autoConfirmations: formData.autoConfirmations,
            allowPartialPayments: formData.allowPartialPayments,
            collectCustomerEmail: formData.collectCustomerEmail,
          },
        },
      });
      toast.success('Settings updated successfully!');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    }
  });

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  const merchant = data?.merchantMe;

  const TABS = [
    { value: 'business', label: 'Business Info', icon: <Iconify icon="mdi:account" /> },
    { value: 'payment', label: 'Payment Settings', icon: <Iconify icon="mdi:credit-card" /> },
  ];

  return (
    <DashboardContent>
      <Typography variant="h4" mb={4}>
        Account Settings
      </Typography>

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

      {currentTab === 'business' && (
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

                  <Field.Text
                    name="email"
                    label="Email Address"
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />

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
                    helperText="We'll send payment status updates to this URL"
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
                Account Status
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={merchant?.isActive ? 'success.main' : 'error.main'}
                  >
                    {merchant?.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Verification
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={merchant?.verifiedAt ? 'success.main' : 'warning.main'}
                  >
                    {merchant?.verifiedAt ? 'Verified' : 'Pending'}
                  </Typography>
                </Stack>
              </Stack>
            </Card>

            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" mb={2}>
                Supported Networks
              </Typography>
              {merchant?.supportedNetworks?.length > 0 ? (
                <Stack spacing={1}>
                  {merchant.supportedNetworks.map((network: any) => (
                    <Stack key={network.id} direction="row" justifyContent="space-between">
                      <Typography variant="body2">
                        {network.network} ({network.currency})
                      </Typography>
                      <Typography
                        variant="caption"
                        color={network.isActive ? 'success.main' : 'text.secondary'}
                      >
                        {network.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No networks configured yet.
                </Typography>
              )}
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
                  {merchant?.webhookSecret
                    ? `${merchant.webhookSecret.slice(0, 8)}${'•'.repeat(32)}${merchant.webhookSecret.slice(-8)}`
                    : 'Not generated'}
                </Box>
                {merchant?.webhookSecret && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(merchant.webhookSecret);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    <Iconify icon="mdi:content-copy" width={18} />
                  </IconButton>
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Use this secret to verify webhook payloads sent to your server.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 'payment' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={3}>
                Payment Configuration
              </Typography>

              <Form methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                  <Field.Text
                    name="defaultExpirationMinutes"
                    label="Payment Expiration (minutes)"
                    type="number"
                    helperText="How long before a payment request expires (1-1440 minutes, default 60)"
                    InputLabelProps={{ shrink: true }}
                  />

                  <Field.Text
                    name="autoConfirmations"
                    label="Required Confirmations"
                    type="number"
                    helperText="Number of blockchain confirmations required before payment is confirmed (1-10)"
                    InputLabelProps={{ shrink: true }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={watch('allowPartialPayments') || false}
                        onChange={(e) => setValue('allowPartialPayments', e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Allow Partial Payments</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Accept payments less than the requested amount
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={watch('collectCustomerEmail') || false}
                        onChange={(e) => setValue('collectCustomerEmail', e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Collect Customer Email</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Require customers to enter email before payment
                        </Typography>
                      </Box>
                    }
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
                    {merchant?.defaultExpirationMinutes || 60} minutes
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Required Confirmations
                  </Typography>
                  <Typography variant="subtitle2">{merchant?.autoConfirmations || 1}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Partial Payments
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={merchant?.allowPartialPayments ? 'success.main' : 'text.secondary'}
                  >
                    {merchant?.allowPartialPayments ? 'Allowed' : 'Not Allowed'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Collect Customer Email
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={merchant?.collectCustomerEmail ? 'success.main' : 'text.secondary'}
                  >
                    {merchant?.collectCustomerEmail ? 'Yes' : 'No'}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}
    </DashboardContent>
  );
}
