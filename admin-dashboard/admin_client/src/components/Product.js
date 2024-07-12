import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { GET_PRODUCTS } from '../graphql/queries';
import { CREATE_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations';

const Products = () => {
    const { loading, error, data } = useQuery(GET_PRODUCTS);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentProduct, setCurrentProduct] = useState({
        id: '',
        name: '',
        salePrice: '',
        originalPrice: '',
        imageSrc: '',
        category: '',
        rating: '',
        description: ''
    });

    const [createProduct] = useMutation(CREATE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });

    const [editProduct] = useMutation(EDIT_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });

    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }]
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleShow = (type, product = {}) => {
        setModalType(type);
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            createProduct({
                variables: {
                    input: {
                        name: currentProduct.name,
                        salePrice: parseFloat(currentProduct.salePrice),
                        originalPrice: parseFloat(currentProduct.originalPrice),
                        imageSrc: currentProduct.imageSrc,
                        category: currentProduct.category,
                        rating: 0,
                        description: currentProduct.description
                    }
                }
            }).catch(err => {
                console.error('Error creating product:', err);
            });
        } else {
            editProduct({
                variables: {
                    id: currentProduct.id,
                    input: {
                        name: currentProduct.name,
                        salePrice: parseFloat(currentProduct.salePrice),
                        originalPrice: parseFloat(currentProduct.originalPrice),
                        imageSrc: currentProduct.imageSrc,
                        category: currentProduct.category,
                        rating: 0,
                        description: currentProduct.description
                    }
                }
                
            }).catch(err => {
                console.error('Error editing product:', err);
            });
        }
        handleClose();
    };

    const handleDelete = (id) => {
        deleteProduct({ variables: { id } }).catch(err => {
            console.error('Error deleting product:', err);
        });
    };

    return (
        <div>
            <h2>Products</h2>
            <Button variant="primary" className="mb-3" onClick={() => handleShow('add')}>Add Product</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Sale Price</th>
                        <th>Original Price</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Rating</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.salePrice}</td>
                            <td>{product.originalPrice}</td>
                            <td><img src={product.imageSrc} alt={product.name} style={{ width: '50px' }} /></td>
                            <td>{product.category}</td>
                            <td>{product.rating}</td>
                            <td>{product.description}</td>
                            <td>
                                <Button variant="secondary" onClick={() => handleShow('edit', product)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'add' ? 'Add Product' : 'Edit Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={currentProduct.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sale Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="salePrice"
                                value={currentProduct.salePrice}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Original Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="originalPrice"
                                value={currentProduct.originalPrice}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image Source</Form.Label>
                            <Form.Control
                                type="text"
                                name="imageSrc"
                                value={currentProduct.imageSrc}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={currentProduct.category}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={0}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={currentProduct.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {modalType === 'add' ? 'Add Product' : 'Save Changes'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Products;
