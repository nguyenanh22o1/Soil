const { gql } = require('apollo-server-express');

const userMutations = gql`
    type Mutation {
        blockUser(id: ID!): User
        unblockUser(id: ID!): User
    }
`;

module.exports = userMutations;