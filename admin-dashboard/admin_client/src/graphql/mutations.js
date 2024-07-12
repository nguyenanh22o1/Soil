import { gql } from '@apollo/client';

// Mutation to block a user
export const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      id
      firstName
      lastName
      email
      isBlocked
    }
  }
`;

// Mutation to unblock a user
export const UNBLOCK_USER = gql`
  mutation UnblockUser($id: ID!){
    unblockUser(id: $id) {
      id
      firstName
      lastName
      email
      isBlocked
    }
  }
`;

// Mutation to create a product
export const CREATE_PRODUCT = gql`
  mutation createProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      salePrice
      originalPrice
      imageSrc
      category
      rating
      description
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      salePrice
      originalPrice
      imageSrc
      category
      rating
      description
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;


export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`
