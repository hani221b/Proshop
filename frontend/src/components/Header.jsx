import React from 'react'
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import {LinkContainer} from "react-router-bootstrap"; 
import { useSelector } from 'react-redux';

const Header = () => {
    const {cartItems} = useSelector(state => state.cart);
    console.log(cartItems);
  return (
    <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <Container>
                <LinkContainer to="">
                    <Navbar.Brand>
                        <img src={logo} alt="proshop" />
                        Proshop
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ms-auto'>
                        <LinkContainer  to="/cart">
                            <Nav.Link><FaShoppingCart />
                             Cart
                             {
                                cartItems.length > 0 && (
                                    <Badge pill bg='success' margin={{marginLeft: '5px'}}>  
                                        {cartItems.reduce((acc, current) => acc + current.qty, 0)}
                                    </Badge>
                                )
                             }
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/login">
                            <Nav.Link><FaUser /> Login</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header