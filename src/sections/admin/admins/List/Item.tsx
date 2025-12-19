import type { Admin } from 'src/__generated__/graphql';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { formatDate } from 'src/utils/format-time';

import { Label } from 'src/components/Label';

import { ActionRender } from '../components/ActionRender';

interface Props {
  admin: Admin;
}

export function Item({ admin }: Props) {
  return (
    <TableRow>
      <TableCell>{admin.name}</TableCell>
      <TableCell>{admin.email}</TableCell>
      <TableCell>{admin.role}</TableCell>
      <TableCell>
        <Label color={admin.isActive ? 'success' : 'error'}>
          {admin.isActive ? 'Active' : 'Inactive'}
        </Label>
      </TableCell>
      <TableCell>{formatDate(admin.createdAt)}</TableCell>
      <TableCell align="right">
        <ActionRender id={admin.id} />
      </TableCell>
    </TableRow>
  );
}
