import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Product from "../components/Product";
import { useGetProductsQuery } from '../slices/productsApiSlice.ts';
import Loader from '../components/Loader.tsx';
import Message from '../components/Message.tsx';
import { CartItem } from '../@types/cart';

const HomeScreen = () => {

  const {data: products, isLoading, error} = useGetProductsQuery("");
  return (
    <>
    {isLoading ? (<Loader />) :
     error ? (<Message variant="danger">"Error"</Message>) : (
      <>
        <h1>Latest products</h1>
        <Row>
            {products ? products.map((product: CartItem) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                </Col>
            )) : []} 
        </Row>
      </>
    )}

    </>
  )
}

export default HomeScreen