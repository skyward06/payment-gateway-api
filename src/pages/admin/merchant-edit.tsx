import { CONFIG } from 'src/config';

import { AdminMerchantEditView } from 'src/sections/admin/merchants';

export default function AdminMerchantEditPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Merchant Edit`}</title>

      <AdminMerchantEditView />
    </>
  );
}
