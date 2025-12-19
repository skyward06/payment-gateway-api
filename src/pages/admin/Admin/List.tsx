import { CONFIG } from 'src/config';

import { AdminsView } from 'src/sections/admin/admins';

export default function AdminsViewPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Admins`}</title>

      <AdminsView />
    </>
  );
}
