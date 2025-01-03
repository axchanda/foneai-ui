import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredUpdatePasswordView } from 'src/sections/auth-demo/centered';

// ----------------------------------------------------------------------

const metadata = { title: `Update password` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredUpdatePasswordView />
    </>
  );
}
