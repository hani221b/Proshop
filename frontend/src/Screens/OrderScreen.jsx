import React from 'react'
import {Link, useParams} from "react-router-dom";
import {Row, Col, ListGroup, Image, Form, Button, Card} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from '../slices/orderApiSlice';

const OrderScreen = () => {
  return (
    <div>OrderScreen</div>
  )
}

export default OrderScreen