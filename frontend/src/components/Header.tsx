import React from 'react'
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import {LinkContainer} from "react-router-bootstrap"; 
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from "../slices/authSlice";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../store";
import { CartItem } from "../@types/cart";

const Header = () => {
    const {cartItems} = useSelector((state: RootState) => state.cart);
    const {userInfo} = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () =>{
        try {
            await logoutApiCall("").unwrap();
            dispatch(logout());
            navigate("/login");
        } catch(err) {
            console.log(err);
        }
    }

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
                                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>  
                                        {cartItems.reduce((acc: number, current: CartItem) => acc + current.qty, 0)}
                                    </Badge>
                                )
                             }
                            </Nav.Link>
                        </LinkContainer>
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id="username">
                                <LinkContainer to="/profile">
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : ( 
                        <LinkContainer to="/login">
                            <Nav.Link><FaUser /> Login</Nav.Link>
                        </LinkContainer>)}
  
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header