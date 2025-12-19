import { CONFIG } from 'src/config';

import { AdminCreateView } from 'src/sections/admin/admins';

export default function AdminCreatePage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Create admin`}</title>

      <AdminCreateView />
    </>
  );
}
