import type { UseBooleanReturn } from 'minimal-shared/hooks';

import Button from '@mui/material/Button';

import { toast } from 'src/components/SnackBar';
import { ConfirmDialog } from 'src/components/ConfirmDialog';

import { useRemoveAdmin } from '../useApollo';

interface Props {
  id: string;
  open: UseBooleanReturn;
}

export function RemoveModal({ id, open }: Props) {
  const { loading, removeAdmin } = useRemoveAdmin();

  const handleRemove = async () => {
    try {
      const { data } = await removeAdmin(id);

      if (data?.removeAdmin) {
        toast.success('Admin removed successfully');
        open.onFalse();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <ConfirmDialog
      title="Remove Admin"
      open={open.value}
      onClose={open.onFalse}
      content="Are you sure you want to remove this admin?"
      action={
        <Button variant="contained" color="error" loading={loading} onClick={handleRemove}>
          Remove
        </Button>
      }
    />
  );
}
