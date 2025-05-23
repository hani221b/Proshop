import React from 'react'
import { useState } from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';


const ShippingScreen = () => {
    const cart  = useSelector((state: any) => state.cart);
    const { shippingAddress } = cart;
    console.log(shippingAddress);
    const [address, setAddress] = useState(shippingAddress?.address || "");
    const [city, setCity] = useState(shippingAddress?.address || "");
    const [postalCode, setPostalCode] = useState(shippingAddress?.address || "");
    const [country, setCountry] = useState(shippingAddress?.address || "");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e: any) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate("/payment");
    }
  return (
    <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
            <FormGroup controlId='address' className='my-2'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type="text"
                    placeholder='Enter Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
            </FormGroup>
            <FormGroup controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control
                    type="text"
                    placeholder='Enter City'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
            </FormGroup>
            <FormGroup controlId='postalCode' className='my-2'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                    type="text"
                    placeholder='Enter Postal Code'
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
            </FormGroup>
            <FormGroup controlId='country' className='my-2'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                    type="text"
                    placeholder='Enter Country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                ></Form.Control>
            </FormGroup>
            <Button type="submit" variant='primary' className='my-2'>
                Continue
            </Button>
        </Form>
    </FormContainer>
  )
}

export default ShippingScreen