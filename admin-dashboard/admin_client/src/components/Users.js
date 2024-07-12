import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button } from 'react-bootstrap';
import { GET_USERS } from '../graphql/queries';
import { BLOCK_USER, UNBLOCK_USER } from '../graphql/mutations';

const Users = () => {
    const { loading, error, data } = useQuery(GET_USERS);

    const [blockUser] = useMutation(BLOCK_USER, {
        refetchQueries: [{ query: GET_USERS }]
    });

    const [unblockUser] = useMutation(UNBLOCK_USER, {
        refetchQueries: [{ query: GET_USERS }]
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const toggleBlock = (id, isBlocked) => {
        if (isBlocked) {
            unblockUser({ variables: { id } });
        } else {
            blockUser({ variables: { id } });
        }
    };

    return (
        <div>
            <h2>Users</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Is Blocked</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.isBlocked ? 'Yes' : 'No'}</td>
                            <td>
                                <Button variant="warning" onClick={() => toggleBlock(user.id, user.isBlocked)}>
                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Users;
