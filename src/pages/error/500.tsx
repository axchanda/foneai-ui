import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';

import { View500 } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: CONFIG.site.name };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <View500 />
    </>
  );
}
