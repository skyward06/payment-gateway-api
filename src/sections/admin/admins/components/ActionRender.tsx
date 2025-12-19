import { usePopover } from 'minimal-shared/hooks';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/Iconify';
import { CustomPopover } from 'src/components/custom-popover';

interface Props {
  id: string;
}

export function ActionRender({ id }: Props) {
  const router = useRouter();
  const popover = usePopover();

  return (
    <>
      <IconButton onClick={popover.onOpen}>
        <Iconify
          icon="mdi:dots-horizontal"
          sx={{ color: popover.open ? 'text.secondary' : 'text.primary' }}
        />
      </IconButton>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem onClick={() => router.push(paths.admin.admins.edit(id))}>
            <Iconify icon="mdi:pencil" />
            Edit
          </MenuItem>
          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon="mdi:delete" />
            Remove
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
