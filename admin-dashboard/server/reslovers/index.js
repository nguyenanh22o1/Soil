const userResolvers = require('./userReslovers');
const productResolvers = require('./productReslovers');
const reviewResolvers = require('./reviewReslovers');

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...productResolvers.Query,
        ...reviewResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...productResolvers.Mutation,
        ...reviewResolvers.Mutation,
    },
    Review: reviewResolvers.Review,
};

module.exports = resolvers;