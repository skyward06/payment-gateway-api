import type { Merchant } from 'src/__generated__/graphql';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/Iconify';

interface Props {
  merchant: Merchant;
}

export function Item({ merchant }: Props) {
  const router = useRouter();

  return (
    <TableRow key={merchant.id} hover>
      <TableCell>{merchant.name}</TableCell>
      <TableCell>{merchant.email}</TableCell>
      <TableCell>{merchant.website || '-'}</TableCell>
      <TableCell>
        <Chip
          size="small"
          label={merchant.isActive ? 'Active' : 'Inactive'}
          color={merchant.isActive ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell>
        {merchant.verifiedAt ? (
          <Chip size="small" label="Verified" color="info" />
        ) : (
          <Chip size="small" label="Unverified" color="warning" />
        )}
      </TableCell>
      <TableCell>{fDateTime(merchant.createdAt)}</TableCell>
      <TableCell align="right">
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="mdi:eye" />}
          onClick={() => router.push(paths.admin.merchants.edit(merchant.id))}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}
