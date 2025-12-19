import { gql } from 'src/__generated__/gql';

export const GET_ADMINS = gql(/* GraphQL */ `
  query GetAdmins($search: String, $isActive: Boolean, $take: Int, $skip: Int) {
    admins(search: $search, isActive: $isActive, take: $take, skip: $skip) {
      admins {
        id
        email
        name
        role
        isActive
        createdAt
      }
      total
    }
  }
`);

export const CREATE_ADMIN = gql(/* GraphQL */ `
  mutation CreateAdmin($data: CreateAdminInput!) {
    createAdmin(data: $data) {
      id
      email
      name
      role
    }
  }
`);
