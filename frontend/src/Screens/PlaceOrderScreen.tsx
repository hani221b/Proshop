import React from 'react'
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {Button, Row, Col, ListGroup, Image, Card, NavItem} from "react-bootstrap";
import CheckoutSteps from '../components/CheckoutSteps';
import { toast, ToastContent } from "react-toastify";
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useCreateOrderMutation } from "../slices/orderApiSlice.ts";
import { clearCartItems } from "../slices/cartSlice"
import { RootState } from '@reduxjs/toolkit/query';
import { CartItem } from '../@types/cart';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);


  const [createOrder, {isLoading, error}] = useCreateOrderMutation();
    console.log(cart);
  useEffect(() => {
    if(!cart.shippingAddress.address){
      navigate("/shipping");
    } else if(!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address. navigate]);
  
  const placeOrderHandler = async () => {
    try {
        const res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemPrice: cart.itemPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();
        console.log(res);
        dispatch(clearCartItems());
        navigate(`/order/${res.id}`);

    } catch(err){
      console.log(err);
        toast.error(err as ToastContent<unknown>)
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 /> 
      <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Address: </strong>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city} {" "},
                    {cart.shippingAddress.postalCode}, {" "}{cart.shippingAddress.country},
                    
                  </p>
              </ListGroup.Item>
              <ListGroup.Item>
                  <h2>Orders Item</h2>
                  {cart.cartItems.length === 0 ? (
                    <Message>Your cart is empty!</Message>
                  ) : (
                    <ListGroup>
                      {cart.cartItems.map((item: CartItem, index: number) => (
                           <ListGroup.Item key={index}>
                           <Row>
                             <Col md={1}>
                               <Image src={item.image} alt={item.name} fluid rounded />
                             </Col>
                             <Col>
                               <Link to={`/products/${item.product}`}>
                                   {item.name}
                               </Link>
                             </Col>
                             <Col md={4}>
                               {item.qty} x {item.price} = ${item.qty * item.price}
                             </Col>
                           </Row>
                       </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                   <ListGroup.Item>
                    <h2>Order Summery</h2>
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <Row>
                        <Col>Items:</Col>
                        <Col>
                        ${cart.itemPrice}</Col>
                      </Row>
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <Row>
                        <Col>Shipping:</Col>
                        <Col>
                        ${cart.shippingPrice}</Col>
                      </Row>
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <Row>
                        <Col>Tax:</Col>
                        <Col>
                        ${cart.taxPrice}</Col>
                      </Row>
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <Row>
                        <Col>Total:</Col>
                        <Col>
                        ${cart.totalPrice}</Col>
                      </Row>
                   </ListGroup.Item>
                   <ListGroup.Item>
                        {error && <Message variant="danger">Error</Message>}
                   </ListGroup.Item>
                   <ListGroup.Item>
                      <Button 
                        type='button'
                        className='btn-block'
                        disabled={cart.cartItems.length === 0}
                        onClick={ placeOrderHandler}
                      >
                        Place Order
                      </Button>
                      {isLoading && <Loader />}
                   </ListGroup.Item>
                </ListGroup>
              </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen