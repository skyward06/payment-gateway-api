import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config';

import { SvgColor } from 'src/components/SvgColor';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic-dashboard'),
  user: icon('ic-user'),
  analytics: icon('ic-analytics'),
  invoice: icon('ic-invoice'),
  lock: icon('ic-lock'),
  admin: icon('ic-admin'),
  file: icon('ic-file'),
  network: icon('ic-network'),
};

// ----------------------------------------------------------------------

// Admin navigation
export const adminNavData = [
  {
    subheader: 'Admin',
    items: [
      { title: 'Dashboard', path: paths.admin.dashboard, icon: ICONS.dashboard },
      { title: 'Merchants', path: paths.admin.merchants, icon: ICONS.user },
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
