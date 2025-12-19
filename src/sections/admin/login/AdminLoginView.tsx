import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { ADMIN_LOGIN } from 'src/graphql';

import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const AdminLoginSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

type AdminLoginSchemaType = zod.infer<typeof AdminLoginSchema>;

// ----------------------------------------------------------------------

export function AdminLoginView() {
  const { signIn } = useAuthContext();
  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { loading }] = useMutation(ADMIN_LOGIN);

  const methods = useForm<AdminLoginSchemaType>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const response = await login({
        variables: {
          data: {
            email: data.email,
            password: data.password,
          },
        },
      });

      if (response.data?.adminLogin?.token) {
        signIn(response.data.adminLogin.token, 'ADMIN');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Login failed');
    }
  });

  return (
    <Stack spacing={4} sx={{ width: 1, maxWidth: 420, mx: 'auto' }}>
      <Stack spacing={1} textAlign="center">
        <Typography variant="h4">Admin Login</Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to access the admin dashboard
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
            name="email"
            label="Email Address"
            placeholder="admin@example.com"
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

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Sign In
          </LoadingButton>
        </Stack>
      </Form>
    </Stack>
  );
}
