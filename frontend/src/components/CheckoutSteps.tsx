import React from 'react'
import {Nav} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface CheckoutStepsProps {
    step1?: boolean;
    step2?: boolean;
    step3?: boolean;
    step4?: boolean;
  }

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  return (
    <Nav className='justify-content-center mb-4'>
        <Nav.Item>
            {step1 ? (
                <LinkContainer to="/login">
                    <Nav.Link>Sign In</Nav.Link>
               </LinkContainer>) : (
                <Nav.Link disabled>Sign In</Nav.Link>
               )}
        </Nav.Item>
        <Nav.Item>
            {step2 ? (
                <LinkContainer to="/shipping">
                    <Nav.Link>Shipping</Nav.Link>
               </LinkContainer>) : (
                <Nav.Link disabled>Shipping</Nav.Link>
               )}
        </Nav.Item>
        <Nav.Item>
            {step3 ? (
                <LinkContainer to="/payment">
                    <Nav.Link>Payment</Nav.Link>
               </LinkContainer>) : (
                <Nav.Link disabled>Payment</Nav.Link>
               )}
        </Nav.Item>
        <Nav.Item>
            {step4 ? (
                <LinkContainer to="/place-order">
                    <Nav.Link>Place Order</Nav.Link>
               </LinkContainer>) : (
                <Nav.Link disabled>Place Order</Nav.Link>
               )}
        </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps