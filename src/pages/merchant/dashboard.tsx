import { CONFIG } from 'src/config';

import { MerchantDashboardView } from 'src/sections/merchant/dashboard';

export default function MerchantDashboardPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Dashboard`}</title>

      <MerchantDashboardView />
    </>
  );
}
