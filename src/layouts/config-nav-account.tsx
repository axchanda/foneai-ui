import { Box, Switch, useColorScheme } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { SvgColor } from 'src/components/svg-color';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------


export const _account = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Iconify icon="hugeicons:dashboard-square-02" />,
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: <Iconify icon="fluent:payment-16-regular" />,
  },
  {
    label: 'Security',
    href: '/account?tab=security',
    icon: <Iconify icon="mdi:security-lock-outline" />,
  },
  {
    label: 'Account',
    href: '/account?tab=general',
    icon: <Iconify icon="codicon:account" />,
  },
  {
    label: 'Dark mode',
    darkModeBtn: true,
    icon: <Iconify icon="mdi:theme-light-dark" />,
    // icon: <SvgColor src={`${CONFIG.site.basePath}/assets/icons/setting/ic-moon.svg`} />
  },
];
