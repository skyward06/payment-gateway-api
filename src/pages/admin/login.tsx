import { CONFIG } from 'src/config';

import { AdminLoginView } from 'src/sections/admin/login';

export default function AdminLoginPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Admin Login`}</title>

      <AdminLoginView />
    </>
  );
}
