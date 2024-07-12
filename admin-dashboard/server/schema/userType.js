const { gql } = require('apollo-server-express');

const userType = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        phoneNumber: String
        isSetupPersonalHealth: Boolean!
        age: Int
        sex: String
        weight: Float
        height: Float
        activityLevel: String
        dateOfBirth: String
        dietaryPreferences: String
        healthGoals: String
        dateJoined: String!
        isBlocked: Boolean!
    }
`;

module.exports = userType;