import type { Admin } from 'src/__generated__/graphql';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { Form, Field } from 'src/components/Form';

import { useActionHook } from './useActionHook';

interface Props {
  current?: Admin;
}

export function AdminEditForm({ current }: Props) {
  const { creating, updating, methods, onSubmit } = useActionHook({ current });

  return (
    <Container>
      <Card>
        <CardHeader title="Create a new Admin" />
        <CardContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
              <Field.Text name="name" label="Name" required />
              <Field.Text name="email" label="Email" required />
              {!current && <Field.Text name="password" label="Password" type="password" required />}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={creating || updating}
              >
                {current ? 'Edit' : 'Create'}
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Stack>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}
