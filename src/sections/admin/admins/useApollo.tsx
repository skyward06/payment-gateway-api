import type { CreateAdminInput } from 'src/__generated__/graphql';

import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { GET_ADMINS, CREATE_ADMIN } from './query';

export function useGetAdmins() {
  const { loading, data } = useQuery(GET_ADMINS, { variables: { take: 50, skip: 0 } });

  return { loading, admins: data?.admins.admins ?? [] };
}

export function useCreateAdmin() {
  const [submit, { loading }] = useMutation(CREATE_ADMIN, {
    awaitRefetchQueries: true,
    refetchQueries: ['GetAdmins'],
  });

  const createAdmin = useCallback(
    (data: CreateAdminInput) => submit({ variables: { data } }),
    [submit]
  );

  return { loading, createAdmin };
}
