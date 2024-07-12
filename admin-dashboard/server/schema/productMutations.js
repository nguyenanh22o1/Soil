const { gql } = require('apollo-server-express');

const productMutations = gql`
    type Mutation {
        createProduct(input: ProductInput!): Product
        updateProduct(id: ID!, input: ProductInput!): Product
        deleteProduct(id: ID!): Boolean
    }
`;

module.exports = productMutations;