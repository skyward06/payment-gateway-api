import { CONFIG } from 'src/config';

import { MerchantLoginView } from 'src/sections/merchant/login';

export default function MerchantLoginPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Login`}</title>

      <MerchantLoginView />
    </>
  );
}
