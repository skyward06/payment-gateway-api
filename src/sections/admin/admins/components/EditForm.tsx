import type { Admin } from 'src/__generated__/graphql';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/SnackBar';
import { Form, Field } from 'src/components/Form';

import { useCreateAdmin } from '../useApollo';
import { Schema, type SchemaType } from './schema';

interface Props {
  current?: Admin;
}

export function AdminEditForm({ current }: Props) {
  const router = useRouter();
  const { loading, createAdmin } = useCreateAdmin();

  const defaultValues = useMemo(
    () => (current ? Schema.safeParse(current).data : { name: '', email: '', password: '' }),
    [current]
  );

  const methods = useForm<SchemaType>({
    defaultValues,
    resolver: zodResolver(Schema),
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (newData) => {
    try {
      const { data } = await createAdmin(newData);

      if (data?.createAdmin) {
        toast.success('Admin created successfully');
        reset();
        router.push(paths.admin.admins.root);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  return (
    <Container>
      <Card>
        <CardHeader title="Create a new Admin" />
        <CardContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
              <Field.Text name="name" label="Name" required />
              <Field.Text name="email" label="Email" required />
              <Field.Text name="password" label="Password" type="password" required />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <LoadingButton type="submit" variant="contained" color="primary" loading={loading}>
                {current ? 'Edit' : 'Create'}
              </LoadingButton>
              <Button variant="outlined">Cancel</Button>
            </Stack>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}
