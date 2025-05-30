import React, { useDebugValue } from 'react'
import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Tab } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice.ts';
import { FaTimes } from 'react-icons/fa';
import { RootState } from '@reduxjs/toolkit/query';

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if(userInfo){
            console.log(userInfo);
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    },[userInfo, userInfo.name, userInfo.email])

    const submitHandler = async (e: any) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password does not match");
        } else {
            try {
                const res = await updateProfile({id: userInfo.id, name, email, password}).unwrap();  
                dispatch(setCredentials(res));  
                toast.success("Profile updated successfully");
            } catch(err){
                toast.error("Error");
            }
        }
    }

    const [updateProfile, {isLoading: loadingUpdateProfile}] =
         useProfileMutation()

    const { data: orders, isLoading, error } = useGetMyOrdersQuery("");

  return <Row>
    <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="name"
                    placeholder='Enter Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId='email' className='my-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId='password' className='my-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='my-2'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>
            <Button
                type='submit'
                variant='primary'
                className='my-2'
            >Update</Button>
            { loadingUpdateProfile && <Loader /> }
        </Form>
    </Col>
    <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (<Loader />) : error ? (<Message variant="danger">Error </Message>)
        : (
            <Table striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>DATE</td>
                        <td>TOTAL</td>
                        <td>PRICE</td>
                        <td>PAID</td>
                        <td>DELIVERED</td>
                    </tr>
                </thead>
                <tbody>
                    { orders.map((order: any) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                                { order.isPaid ? (
                                    order.paidAt.substring(0, 10)
                                ) : (
                                    <FaTimes style={{color: "red"}} />
                                ) }
                            </td>
                            <td>
                                { order.isDelivered ? (
                                    order.deliveredAt.substring(0, 10)
                                ) : (
                                    <FaTimes style={{color: "red"}} />
                                ) }
                            </td>
                            <td>
                                <LinkContainer to={`/order/${order.id}`}>
                                    <Button className='btn-sm' variant='light'>   
                                        Details
                                    </Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    )) }
                </tbody>
            </Table>
        )}
    </Col>
  </Row>;
}

export default ProfileScreen