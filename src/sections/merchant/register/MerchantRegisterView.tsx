import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { MERCHANT_REGISTER } from 'src/graphql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

// ----------------------------------------------------------------------

const MerchantRegisterSchema = zod
  .object({
    name: zod
      .string()
      .min(1, { message: 'Business name is required!' })
      .min(2, { message: 'Business name must be at least 2 characters!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    password: zod
      .string()
      .min(1, { message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
    website: zod.string().url({ message: 'Must be a valid URL!' }).optional().or(zod.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type MerchantRegisterSchemaType = zod.infer<typeof MerchantRegisterSchema>;

// ----------------------------------------------------------------------

export function MerchantRegisterView() {
  const router = useRouter();
  const password = useBoolean();
  const confirmPassword = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const [register, { loading }] = useMutation(MERCHANT_REGISTER);

  const methods = useForm<MerchantRegisterSchemaType>({
    resolver: zodResolver(MerchantRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      website: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await register({
        variables: {
          data: {
            name: data.name,
            email: data.email,
            password: data.password,
            website: data.website || undefined,
          },
        },
      });

      toast.success('Registration successful! Please login.');
      router.push(paths.auth.merchantLogin);
    } catch (error: any) {
      setErrorMsg(error.message || 'Registration failed');
    }
  });

  return (
    <Stack spacing={4} sx={{ width: 1, maxWidth: 480, mx: 'auto' }}>
      <Stack spacing={1} textAlign="center">
        <Typography variant="h4">Create Merchant Account</Typography>
        <Typography variant="body2" color="text.secondary">
          Start accepting crypto payments today
        </Typography>
      </Stack>

      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Text
            name="name"
            label="Business Name"
            placeholder="Your Business"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="email"
            label="Email Address"
            placeholder="merchant@example.com"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="website"
            label="Website (Optional)"
            placeholder="https://yourwebsite.com"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Field.Text
            name="confirmPassword"
            label="Confirm Password"
            type={confirmPassword.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={confirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Create Account
          </LoadingButton>
        </Stack>
      </Form>

      <Typography variant="body2" textAlign="center">
        Already have an account?{' '}
        <Link component={RouterLink} href={paths.auth.merchantLogin} variant="subtitle2">
          Sign In
        </Link>
      </Typography>
    </Stack>
  );
}
