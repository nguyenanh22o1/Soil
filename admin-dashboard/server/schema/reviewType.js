const { gql } = require('apollo-server-express');

const reviewType = gql`
  type Review {
    id: ID!
    userRating: Int!
    text: String
    userId: Int!
    productId: Int!
    deletedByAdmin: Boolean!
    user: User!
    product: Product!
  }
`;

module.exports = reviewType;