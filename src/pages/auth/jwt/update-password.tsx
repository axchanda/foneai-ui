import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SplitUpdatePasswordView } from 'src/sections/auth-demo/split';

// ----------------------------------------------------------------------

const metadata = { title: `Update password` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SplitUpdatePasswordView />
    </>
  );
}
