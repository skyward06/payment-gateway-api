import { CONFIG } from 'src/config';

import { AdminPaymentsView } from 'src/sections/admin/payments';

export default function AdminPaymentsPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Payments`}</title>

      <AdminPaymentsView />
    </>
  );
}
