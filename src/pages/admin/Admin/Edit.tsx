import { CONFIG } from 'src/config';

import { AdminEditView } from 'src/sections/admin/admins';

export default function AdminEditPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Edit Admin`}</title>

      <AdminEditView />
    </>
  );
}
