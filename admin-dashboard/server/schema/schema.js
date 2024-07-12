const { gql } = require('apollo-server-express');
const userType = require('./userType');
const productType = require('./productType');
const reviewType = require('./reviewType');
const userMutations = require('./userMutations');
const productMutations = require('./productMutations');
const reviewMutations = require('./reviewMutations');

const rootQuery = gql`
    type Query {
        users: [User!]!
        user(id: ID!): User
        products: [Product!]!
        product(id: ID!): Product
        reviews: [Review!]!
        review(id: ID!): Review
    }
`;

const schema = gql`
    ${userType}
    ${productType}
    ${reviewType}
    ${rootQuery}
    ${userMutations}
    ${productMutations}
    ${reviewMutations}
`;

module.exports = schema;