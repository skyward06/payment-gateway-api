import { CONFIG } from 'src/config';

import { AdminMerchantsView } from 'src/sections/admin/merchants';

export default function AdminMerchantsPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Merchants`}</title>

      <AdminMerchantsView />
    </>
  );
}
