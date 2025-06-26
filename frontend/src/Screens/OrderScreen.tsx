import React from 'react'
import {Link, useParams} from "react-router-dom";
import {Row, Col, ListGroup, Image, Card, Button} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery,
   useLazyRedirectToCheckoutQuery,
   useGetPayPalClientIdQuery  } from '../slices/orderApiSlice.ts';
import { PayPalButtons, usePayPalScriptReducer, DISPATCH_ACTION, SCRIPT_LOADING_STATE } from "@paypal/react-paypal-js";
import {toast} from "react-toastify";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../store';
import { CartItem } from '../@types/cart';
// import { PayPalScriptAction } from '@paypal/react-paypal-js';

interface Order {
  id: number;
  user: {
    name: string;
    email: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  orderItems: CartItem[];
  itemPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
}

interface PayPalClientId {
  clientId: string;
}


const OrderScreen: React.FC = () => {
  const { id: orderId} = useParams<{ id: string }>();
  const { data: {order, user} = {}, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    
  // const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
  const [redirectToCheckout, {isLoading: loadingRedirctToCheckout}] = useLazyRedirectToCheckoutQuery();

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  const {userInfo} = useSelector((state: RootState) => state.auth);

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery("");

  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId){
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: DISPATCH_ACTION.RESET_OPTIONS,
          value: {
            clientId: paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({
          type: DISPATCH_ACTION.LOADING_STATUS,
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      if (order && !order.isPaid && !window.paypal) {
        loadPayPalScript();
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // async function onApprove(_: any, actions: any){
  //   return actions.order.capture().then(async function (details: any){
  //     try {
  //       await payOrder({orderId, details});
  //       refetch();         
  //       toast.success("Payment Successful");
  //     }catch(err){
  //       toast.error("Somethin went wrong");
  //     }
  //   });
  // }

  const [triggerCheckout, { isFetching }] = useLazyRedirectToCheckoutQuery();

  const handleClick = async () => {
      try {
        const result = await triggerCheckout({ orderId }).unwrap();

        if (result?.url) {
          window.location.href = result.url;
        } else {
          console.error("No checkout URL received");
        }
      } catch (err) {
        console.error("Failed to create Stripe Checkout session", err);
      }
  };

  async function onApproveTest(){
       await redirectToCheckout({orderId, details: {payer: {}}});
        // refetch();         
        // toast.success("Payment Successful");
  }

  function onError(err: any){
    toast.error(err?.data?.message || err.message);
  }

  function createOrder(_: any, actions: any){
    return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice
            }
          }
        ]
    }).then((orderId: string) => {
      return orderId;
    });
  }
  return isLoading ? <Loader /> : error ? <Message children="" variant="danger" /> :
  (
    <>
      <h1>Order {order.id}</h1>
      <Row>
        <Col md={8}>
            <ListGroup>
              <ListGroup.Item>
                 <h2>Shipping</h2>
                 <p>
                  <strong>Name: </strong> { user.name } 
                 </p>
                 <p>
                  <strong>Email: </strong> { user.email}
                 </p>
                 <p>
                  <strong>Address: </strong>
                   {order.shippingAddress.address}, {order.shippingAddress.city} {" "}
                   {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                 </p>
                 {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                 ) : (
                  <Message variant="danger">
                    Not Delivered
                  </Message>
                 )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">
                    Paid on {order.paidAt}
                  </Message>
                 ) : (
                  <Message variant="danger">
                    Not Paid
                  </Message>
                 )}
              </ListGroup.Item>
              <ListGroup>
                <h2>Order Items</h2>
                {order.orderItems.map((item: CartItem, index: number) => (
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
                        {item.qty} x ${order.itemPrice} = ${item.qty * order.itemPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup>
        </Col>
        <Col md={4}>
             <Card>
              <ListGroup>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemPrice}</Col>
                  </Row>

                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>

                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>

                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingRedirctToCheckout && <Loader />}
                  <Button onClick={handleClick} disabled={isFetching} style={{marginBottom: "10px"}}>
                      {isFetching ? "Redirecting..." : "Pay Now"}
                    </Button>
                    {/* <Button onClick={onApproveTest} > Pay Now</Button> */}
                    {/* {isPending ? <Loader /> : (
                      <div>
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      </div>
                    )} */}
                  </ListGroup.Item>
                )}
              </ListGroup>
             </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen