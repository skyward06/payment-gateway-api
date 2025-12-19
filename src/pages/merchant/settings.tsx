import { CONFIG } from 'src/config';

import { MerchantSettingsView } from 'src/sections/merchant/settings';

export default function MerchantSettingsPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Settings`}</title>

      <MerchantSettingsView />
    </>
  );
}
