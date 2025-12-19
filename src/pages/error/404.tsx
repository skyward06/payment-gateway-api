import { CONFIG } from 'src/config';

import { NotFoundView } from 'src/sections/error';

const metadata = { title: `${CONFIG.appName} - Error` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <NotFoundView />
    </>
  );
}
