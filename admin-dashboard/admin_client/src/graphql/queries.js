import { gql } from '@apollo/client';

// Query to get all users
export const GET_USERS = gql`
    query GetUsers {
        users {
            id
            firstName
            lastName
            email
            isBlocked
        }
    }
`;

// Query to get all products
export const GET_PRODUCTS = gql`
    query GetProducts {
        products {
            id
            name
            description
            salePrice
            originalPrice
            imageSrc
            rating
            category
        }
    }
`;

export const GET_REVIEWS = gql`
    query GetReviews {
        reviews {
        id
        userRating
        text
        user {
            id
            firstName
            lastName
            email
        }
        product {
            id
            name
            salePrice
            originalPrice
        }
        deletedByAdmin
        }
    }
`;
