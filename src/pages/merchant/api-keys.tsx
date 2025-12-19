import { CONFIG } from 'src/config';

import { MerchantApiKeysView } from 'src/sections/merchant/api-keys';

export default function MerchantApiKeysPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - API Keys`}</title>

      <MerchantApiKeysView />
    </>
  );
}
