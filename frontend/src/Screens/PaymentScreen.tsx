import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { RootState } from '@reduxjs/toolkit/query';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState("PayPal"); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state: any) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if(!shippingAddress){
            navigate("/shipping");
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e: any) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/place-order")
    }
  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as="legend">Select Method</Form.Label>
                <Col>
                    <Form.Check 
                        type="radio"
                        className='my-2'
                        label="PayPal or Credit Card"
                        name="paymentMethod"
                        value="PayPal"
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                </Col>
            </Form.Group>
            <Button type='submit'variant='primary'>
                Continue
            </Button>
        </Form>
     </FormContainer>
  )
}

export default PaymentScreen