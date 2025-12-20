import type { Admin } from 'src/__generated__/graphql';
import type { IconifyName } from 'src/components/Iconify';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { RemoveModal } from './RemoveModal';
import { useActivateAdmin, useDeactivateAdmin } from '../useApollo';

interface Props {
  current: Admin;
}

export function ActionRender({ current }: Props) {
  const open = useBoolean();
  const router = useRouter();
  const popover = usePopover();

  const { loading: activating, activateAdmin } = useActivateAdmin();
  const { loading: deactivating, deactivateAdmin } = useDeactivateAdmin();

  const handleActivation = async (isActive: boolean) => {
    try {
      const actionPromise = isActive
        ? await deactivateAdmin(current.id)
        : await activateAdmin(current.id);

      const { data } = await actionPromise;

      if (data) {
        toast.success('Successfully done!');
        popover.onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
          <MenuItem onClick={() => router.push(paths.admin.admins.edit(current.id))}>
            <Iconify icon="mdi:pencil" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleActivation(current.isActive)}>
            <Iconify
              icon={
                (activating || deactivating
                  ? 'mdi:account-cancel'
                  : current.isActive
                    ? 'mdi:account-cancel'
                    : 'mdi:account-check') as IconifyName
              }
            />
            {current.isActive ? 'Deactivate' : 'Activate'}
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              open.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:delete" />
            Remove
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {open.value && current.id && <RemoveModal id={current.id} open={open} />}
    </>
  );
}
