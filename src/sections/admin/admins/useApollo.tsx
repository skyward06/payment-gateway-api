import type { CreateAdminInput, UpdateAdminInput } from 'src/__generated__/graphql';

import { useCallback } from 'react';
import { useMutation, useSuspenseQuery } from '@apollo/client';

import {
  FETCH_ADMINS,
  CREATE_ADMIN,
  UPDATE_ADMIN,
  REMOVE_ADMIN,
  ACTIVATE_ADMIN,
  DEACTIVATE_ADMIN,
} from './query';

export function useFetchAdmins() {
  const { data } = useSuspenseQuery(FETCH_ADMINS, { variables: { take: 50, skip: 0 } });

  return { admins: data?.admins.admins ?? [] };
}

export function useCreateAdmin() {
  const [submit, { loading }] = useMutation(CREATE_ADMIN, {
    awaitRefetchQueries: true,
    refetchQueries: ['Admins'],
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
    refetchQueries: ['Admins'],
  });

  const updateAdmin = useCallback(
    (data: UpdateAdminInput) => submit({ variables: { data } }),
    [submit]
  );

  return { loading, updateAdmin };
}

export function useRemoveAdmin() {
  const [submit, { loading }] = useMutation(REMOVE_ADMIN, {
    awaitRefetchQueries: true,
    refetchQueries: ['Admins'],
  });

  const removeAdmin = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );

  return { loading, removeAdmin };
}

export function useActivateAdmin() {
  const [submit, { loading }] = useMutation(ACTIVATE_ADMIN, {
    awaitRefetchQueries: true,
    refetchQueries: ['Admins'],
  });

  const activateAdmin = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );

  return { loading, activateAdmin };
}

export function useDeactivateAdmin() {
  const [submit, { loading }] = useMutation(DEACTIVATE_ADMIN, {
    awaitRefetchQueries: true,
    refetchQueries: ['Admins'],
  });

  const deactivateAdmin = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );

  return { loading, deactivateAdmin };
}
