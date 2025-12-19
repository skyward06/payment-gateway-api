import { CONFIG } from 'src/config';

import { MerchantNetworksView } from 'src/sections/merchant/networks';

export default function MerchantNetworksPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Payment Networks`}</title>

      <MerchantNetworksView />
    </>
  );
}
