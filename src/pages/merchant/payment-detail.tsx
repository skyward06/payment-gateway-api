import { CONFIG } from 'src/config';

import { MerchantPaymentDetailView } from 'src/sections/merchant/payments';

export default function MerchantPaymentDetailPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Payment Details`}</title>

      <MerchantPaymentDetailView />
    </>
  );
}
