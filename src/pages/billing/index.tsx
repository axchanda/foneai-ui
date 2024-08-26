import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useNavigate, useSearchParams } from 'react-router-dom';
import Credit from 'src/sections/billing/credit';
import { _userAddressBook, _userPayment, _userPlans } from 'src/_mock';
import { AccountBillingPlan } from 'src/sections/account/account-billing-plan';
import { AccountBillingAddress } from 'src/sections/account/account-billing-address';
import { BillingInvoices } from 'src/sections/billing/invoices';
// import { AccountGeneral } from '../account-general';
// import { AccountBilling } from '../account-billing';
// import { AccountSocialLinks } from '../account-social-links';
// import { AccountNotifications } from '../account-notifications';
// import { AccountChangePassword } from '../account-change-password';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'credit', label: 'Credit', icon: <Iconify icon="lets-icons:credit-card" width={24} /> },
  {
    value: 'plans',
    label: 'Plans',
    icon: <Iconify icon="material-symbols-light:next-plan" width={24} />,
  },
  {
    value: 'addresses',
    label: 'Addresses',
    icon: <Iconify icon="entypo:address" width={24} />,
  },
  // { value: 'social', label: 'Social links', icon: <Iconify icon="solar:share-bold" width={24} /> },
  {
    value: 'invoices',
    label: 'Invoices',
    icon: <Iconify icon="fa-solid:file-invoice" width={24} />,
  },
];

// ----------------------------------------------------------------------
function BillingPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const selectedTab =
    TABS.find((t) => t.value.toLowerCase() === tab?.toLowerCase())?.value || 'credit';
  const tabs = useTabs(selectedTab, selectedTab);
  const navigate = useNavigate();
  // console.log({ tab, tabs, selectedTab });
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Billing"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'User', href: paths.dashboard.user.root },
        //   { name: 'Account' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((t) => (
          <Tab
            onClick={() => {
              // const url = searchParams.set('tab', tab.value)
              navigate(`/billing?tab=${t.value}`);
            }}
            key={t.value}
            label={t.label}
            icon={t.icon}
            value={t.value}
          />
        ))}
      </Tabs>

      {tabs.value === 'credit' && <Credit />}

      {tabs.value === 'plans' && (
        <AccountBillingPlan
          plans={_userPlans}
          cardList={_userPayment}
          addressBook={_userAddressBook}
        />
      )}

      {tabs.value === 'addresses' && <AccountBillingAddress addressBook={_userAddressBook} />}

      {/* {tabs.value === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />} */}

      {tabs.value === 'invoices' && <BillingInvoices />}
    </DashboardContent>
  );
}

export default BillingPage;
