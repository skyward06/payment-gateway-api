import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/Iconify';
import { TableNoData } from 'src/components/Table';

import { Item } from './Item';
import { useFetchAdmins } from '../useApollo';

export function AdminsView() {
  const router = useRouter();
  const { admins } = useFetchAdmins();

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Admins</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => router.push(paths.admin.admins.new)}
        >
          New Admin
        </Button>
      </Stack>

      <Card>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={100}>Created At</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin: any) => (
                <Item key={admin.id} admin={admin} />
              ))}

              <TableNoData notFound={!admins.length} />
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
}
