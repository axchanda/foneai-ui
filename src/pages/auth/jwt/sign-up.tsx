import { Helmet } from 'react-helmet-async';

import { JwtSignUpView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Fone AI` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignUpView />
    </>
  );
}
