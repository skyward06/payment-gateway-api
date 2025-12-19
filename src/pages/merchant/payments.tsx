import { CONFIG } from 'src/config';

import { MerchantPaymentsView } from 'src/sections/merchant/payments';

export default function MerchantPaymentsPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Payments`}</title>

      <MerchantPaymentsView />
    </>
  );
}
