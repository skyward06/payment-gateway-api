import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';

import { paths } from 'src/routes/paths';

import { AdminContext } from './AdminContext';
import { useFetchAdminById } from '../useApollo';

interface Props {
  children: React.ReactNode;
}

export function AdminProvider({ children }: Props) {
  const { id } = useParams();

  const { admin } = useFetchAdminById(id!);

  const memoizedValue = useMemo(() => ({ admin }), [admin]);

  if (!admin) {
    return <Navigate to={paths.notFound} />;
  }

  return <AdminContext.Provider value={memoizedValue}>{children}</AdminContext.Provider>;
}
