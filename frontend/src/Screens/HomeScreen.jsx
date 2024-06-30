import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Product from "../components/Product";
import axios from "axios";

const HomeScreen = () => {

  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <>
        <h1>Latest products</h1>
        <Row>
            {products ? products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                </Col>
            )) : []} 
        </Row>
    </>
  )
}

export default HomeScreen