import { CONFIG } from 'src/config';

import { PaymentPageView } from 'src/sections/pay';

export default function PaymentPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Order`}</title>

      <PaymentPageView />
    </>
  );
}
