// src/components/Reviews.js
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button } from 'react-bootstrap';
import { GET_REVIEWS } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';

const Reviews = () => {
    const { loading, error, data } = useQuery(GET_REVIEWS);
    const [deleteReview] = useMutation(DELETE_REVIEW, {
        refetchQueries: [{ query: GET_REVIEWS }]
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleDelete = (id) => {
        deleteReview({ variables: { id } });
    };

    return (
        <div>
            <h2>Reviews</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Rating</th>
                        <th>Text</th>
                        <th>User</th>
                        <th>Product</th>
                        <th>Deleted By Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.reviews.map(review => (
                        <tr key={review.id}>
                            <td>{review.id}</td>
                            <td>{review.userRating}</td>
                            <td>{review.text}</td>
                            <td>{`${review.user.firstName} ${review.user.lastName}`}</td>
                            <td>{review.product.name}</td>
                            <td>{review.deletedByAdmin ? 'Yes' : 'No'}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(review.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Reviews;
