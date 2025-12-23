import { useCallback } from 'react';
import { useQuery, useMutation, useSuspenseQuery } from '@apollo/client';

import { useQuery as useQueryString } from 'src/routes/hooks';

import {
  FETCH_MERCHANT,
  FETCH_MERCHANTS,
  VERIFY_MERCHANT,
  DELETE_MERCHANT,
  ACTIVATE_MERCHANT,
  UNVERIFY_MERCHANT,
  DEACTIVATE_MERCHANT,
  ADMIN_UPDATE_MERCHANT,
} from './query';

export function useFetchMerchants(variables = { take: 50, skip: 0 }) {
  const [{filter, page, sort}] = useQueryString()

  const { loading, data } = useQuery(FETCH_MERCHANTS, { variables: {search: } });

  return { loading, merchants: data?.merchants.merchants ?? [], total: data?.merchants.total ?? 0 };
}

export function useFetchMerchant(id: string) {
  const { data } = useSuspenseQuery(FETCH_MERCHANT, { variables: { data: { id } } });
  return { merchant: data?.merchant };
}

export function useAdminUpdateMerchant() {
  const [submit, { loading }] = useMutation(ADMIN_UPDATE_MERCHANT);
  const updateMerchant = useCallback((data: any) => submit({ variables: { data } }), [submit]);
  return { loading, updateMerchant };
}

export function useActivateMerchant() {
  const [submit, { loading }] = useMutation(ACTIVATE_MERCHANT);
  const activateMerchant = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );
  return { loading, activateMerchant };
}

export function useDeactivateMerchant() {
  const [submit, { loading }] = useMutation(DEACTIVATE_MERCHANT);
  const deactivateMerchant = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );
  return { loading, deactivateMerchant };
}

export function useVerifyMerchant() {
  const [submit, { loading }] = useMutation(VERIFY_MERCHANT);
  const verifyMerchant = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );
  return { loading, verifyMerchant };
}

export function useUnverifyMerchant() {
  const [submit, { loading }] = useMutation(UNVERIFY_MERCHANT);
  const unverifyMerchant = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );
  return { loading, unverifyMerchant };
}

export function useDeleteMerchant() {
  const [submit, { loading }] = useMutation(DELETE_MERCHANT);
  const deleteMerchant = useCallback(
    (id: string) => submit({ variables: { data: { id } } }),
    [submit]
  );
  return { loading, deleteMerchant };
}
