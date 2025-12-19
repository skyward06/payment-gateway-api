import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config';

import { SvgColor } from 'src/components/SvgColor';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  admin: icon('ic-admin'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  file: icon('ic-file'),
  invoice: icon('ic-invoice'),
  lock: icon('ic-lock'),
  merchant: icon('ic-merchant'),
  network: icon('ic-network'),
  user: icon('ic-user'),
};

// ----------------------------------------------------------------------

// Admin navigation
export const adminNavData = [
  {
    subheader: 'Admin',
    items: [
      { title: 'Dashboard', path: paths.admin.dashboard, icon: ICONS.dashboard },
      { title: 'Merchants', path: paths.admin.merchants, icon: ICONS.merchant },
      { title: 'Payments', path: paths.admin.payments, icon: ICONS.invoice },
      { title: 'Admins', path: paths.admin.admins.root, icon: ICONS.admin },
    ],
  },
];

// Merchant navigation
export const merchantNavData = [
  {
    subheader: 'Merchant',
    items: [
      { title: 'Dashboard', path: paths.merchant.dashboard, icon: ICONS.analytics },
      { title: 'Payments', path: paths.merchant.payments, icon: ICONS.invoice },
      { title: 'Networks', path: paths.merchant.networks, icon: ICONS.network },
      { title: 'API Keys', path: paths.merchant.apiKeys, icon: ICONS.lock },
      { title: 'Settings', path: paths.merchant.settings, icon: ICONS.file },
    ],
  },
];

// Legacy export for backward compatibility - use merchantNavData
export const navData = merchantNavData;
