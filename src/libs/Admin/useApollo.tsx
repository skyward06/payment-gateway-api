import { useSuspenseQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';

export const FETCH_ADMIN_BY_ID = gql(/* GraphQL */ `
  query Admin($data: IDInput!) {
    admin(data: $data) {
      id
      email
      name
      role
      isActive
      createdAt
    }
  }
`);

export function useFetchAdminById(id: string) {
  const { data } = useSuspenseQuery(FETCH_ADMIN_BY_ID, { variables: { data: { id } } });

  return { admin: data?.admin };
}
