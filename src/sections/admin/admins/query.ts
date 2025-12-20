import { gql } from 'src/__generated__/gql';

export const FETCH_ADMINS = gql(/* GraphQL */ `
  query Admins($search: String, $isActive: Boolean, $take: Int, $skip: Int) {
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
    }
  }
`);

export const UPDATE_ADMIN = gql(/* GraphQL */ `
  mutation UpdateAdmin($data: UpdateAdminInput!) {
    updateAdmin(data: $data) {
      id
    }
  }
`);

export const REMOVE_ADMIN = gql(/* GraphQL */ `
  mutation RemoveAdmin($data: IDInput!) {
    removeAdmin(data: $data) {
      id
    }
  }
`);

export const ACTIVATE_ADMIN = gql(/* GraphQL */ `
  mutation ActivateAdmin($data: IDInput!) {
    activateAdmin(data: $data) {
      id
    }
  }
`);

export const DEACTIVATE_ADMIN = gql(/* GraphQL */ `
  mutation DeactivateAdmin($data: IDInput!) {
    deactivateAdmin(data: $data) {
      id
    }
  }
`);
