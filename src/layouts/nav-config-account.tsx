import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

// Admin account menu items
export const adminAccountNav = [
  {
    label: 'Dashboard',
    href: paths.admin.dashboard,
    icon: <Iconify icon="mdi:view-dashboard" />,
  },
  {
    label: 'Merchants',
    href: paths.admin.merchants,
    icon: <Iconify icon="mdi:store" />,
  },
  {
    label: 'Payments',
    href: paths.admin.payments,
    icon: <Iconify icon="mdi:credit-card" />,
  },
  {
    label: 'Admins',
    href: paths.admin.admins.root,
    icon: <Iconify icon="mdi:account-group" />,
  },
];

// Merchant account menu items
export const merchantAccountNav = [
  {
    label: 'Dashboard',
    href: paths.merchant.dashboard,
    icon: <Iconify icon="mdi:view-dashboard" />,
  },
  {
    label: 'Payments',
    href: paths.merchant.payments,
    icon: <Iconify icon="mdi:credit-card" />,
  },
  {
    label: 'API Keys',
    href: paths.merchant.apiKeys,
    icon: <Iconify icon="mdi:key" />,
  },
  {
    label: 'Settings',
    href: paths.merchant.settings,
    icon: <Iconify icon="mdi:cog" />,
  },
];

// Default export for backwards compatibility
export const _account = merchantAccountNav;
