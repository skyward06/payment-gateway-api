import { CONFIG } from 'src/config';

import { AdminDashboardView } from 'src/sections/admin/dashboard';

export default function AdminDashboardPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Admin Dashboard`}</title>

      <AdminDashboardView />
    </>
  );
}
