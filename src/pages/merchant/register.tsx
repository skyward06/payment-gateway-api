import { CONFIG } from 'src/config';

import { MerchantRegisterView } from 'src/sections/merchant/register';

export default function MerchantRegisterPage() {
  return (
    <>
      <title>{`${CONFIG.appName} - Register`}</title>

      <MerchantRegisterView />
    </>
  );
}
