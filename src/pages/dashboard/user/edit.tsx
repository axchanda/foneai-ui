import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { _userList } from 'src/_mock/_user';

import { UserEditView } from 'src/sections/user/view';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const metadata = { title: CONFIG.site.name };

export default function Page() {
  const { id = '' } = useParams();

  const currentUser = _userList.find((user) => user.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={currentUser} />
    </>
  );
}
