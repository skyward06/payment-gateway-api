import type { CreateAdminInput, UpdateAdminInput } from 'src/__generated__/graphql';

import { useCallback } from 'react';
import { useMutation, useSuspenseQuery } from '@apollo/client';

import { GET_ADMINS, CREATE_ADMIN, UPDATE_ADMIN } from './query';

export function useGetAdmins() {
  const { data } = useSuspenseQuery(GET_ADMINS, { variables: { take: 50, skip: 0 } });

  return { admins: data?.admins.admins ?? [] };
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

export function useUpdateAdmin() {
  const [submit, { loading }] = useMutation(UPDATE_ADMIN, {
    awaitRefetchQueries: true,
    refetchQueries: ['GetAdmins'],
  });

  const updateAdmin = useCallback(
    (data: UpdateAdminInput) => submit({ variables: { data } }),
    [submit]
  );

  return { loading, updateAdmin };
}
