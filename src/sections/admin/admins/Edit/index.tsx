import { useAdminContext } from 'src/libs/Admin/Context/useAdminContext';

import { AdminEditForm } from '../components/EditForm';

export function AdminEditView() {
  const { admin } = useAdminContext();

  return <AdminEditForm current={admin} />;
}
