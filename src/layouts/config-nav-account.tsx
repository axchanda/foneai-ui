import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Iconify icon="ic-dashboard" />,
  },
  // {
  //   label: 'Billing',
  //   href: '/billing',
  //   icon: <Iconify icon="fluent:payment-16-filled" />,
  // },
  {
    label: 'Security',
    href: '/account?tab=security',
    icon: <Iconify icon="ic:round-security" />,
  },
  {
    label: 'Account',
    href: '/account?tab=general',
    icon: <Iconify icon="material-symbols:account-circle" />,
  },
  // {
  //   label: 'Invoices',
  //   href: '/invoices',
  //   icon: <Iconify icon="hugeicons:invoice" />,
  // },
];
