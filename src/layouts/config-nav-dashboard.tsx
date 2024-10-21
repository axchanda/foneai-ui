import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <Iconify width={16} icon={name} color="primary" sx={{ flexShrink: 0 }} />
);

const ICONS = {
  asterisk: icon('simple-icons:asterisk'),
  dashboard: icon('ic-dashboard'),
  bots: icon('file-icons:robots'),
  users: icon('heroicons:users-solid'),
  campaigns: icon('ic:round-campaign'),
  invoices: icon('hugeicons:invoice'),
  account: icon('material-symbols:account-circle'),
  knowledgeBase: icon('simple-icons:docsdotrs'),
  apiManager: icon('material-symbols:api'),
  zaps: icon('token:zap'),
  setup: icon('mdi:spanner'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  parameter: icon('ic-parameter'),
  billing: icon('entypo:credit'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Dashboard',
    permission: 'dashboard.view',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: ICONS.dashboard,
      },
    ],
  },
  {
    subheader: 'App',
    items: [
      {
        title: 'Bots',
        path: '/bots',
        icon: ICONS.bots,
      },
      {
        title: 'Campaigns',
        path: '/campaigns',
        icon: ICONS.campaigns,
      },
      {
        title: 'Knowledge Bases',
        path: '/knowledge-bases',
        icon: ICONS.knowledgeBase,
      },
      {
        title: 'API Manager',
        path: '/apiEndpoints',
        icon: ICONS.apiManager,
      },
      {
        title: 'Zaps',
        path: '/zaps',
        icon: ICONS.zaps,
      },
    ],
  },
  {
    subheader: 'Integrations',
    items: [
      {
        title: 'Asterisk',
        path: '/integrations-asterisk',
        icon: ICONS.asterisk,
      },
      // {
      //   title: 'Billing',
      //   path: '/billing',
      //   icon: ICONS.billing,
      //   permission: 'billing.view',
      // },
    ],
  },
];
