const { gql } = require('apollo-server-express');

const productType = gql`
    type Product {
        id: ID!
        name: String!
        salePrice: Float!
        originalPrice: Float!
        imageSrc: String!
        category: String!
        rating: Int!
        description: String!
    }

    input ProductInput {
        name: String!
        salePrice: Float!
        originalPrice: Float!
        imageSrc: String!
        category: String!
        rating: Int!
        description: String!
    }
`;

module.exports = productType;