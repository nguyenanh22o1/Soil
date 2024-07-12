const { gql } = require('apollo-server-express');

const reviewMutations = gql`
    type Mutation {
        deleteReview(id: ID!): Boolean
    }
`;

module.exports = reviewMutations;