import { useSuspenseQuery } from '@apollo/client';

import { FETCH_PAYMENT, FETCH_ADMIN_PAYMENTS } from './query';

export function useFetchAdminPayments(variables = { take: 10, skip: 0 }) {
  const { data } = useSuspenseQuery(FETCH_ADMIN_PAYMENTS, { variables });
  return {
    payments: data?.adminPayments?.payments ?? [],
    total: data?.adminPayments?.total ?? 0,
  };
}

export function useFetchPayment(id: string) {
  const { data } = useSuspenseQuery(FETCH_PAYMENT, { variables: { data: { id } } });
  return { payment: data?.payment };
}
