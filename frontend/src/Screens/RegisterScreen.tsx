import React from 'react'
import { useState, useEffect } from 'react'
import {Link, useLocation, useNavigate} from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from '../components/FormContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();

    const { userInfo } = useSelector((state: any) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if(userInfo){
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);
 
    const submitHandler = async (e: any) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password does not match!");
            return;
        } else {
            try {
                const res = await register({name, email, password}).unwrap();
                dispatch(setCredentials({...res}));
                navigate(redirect);
            } catch(err) {
                toast.error("Something went wrong");
            }
        }
    }
  return (
    <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type='text'
                    value={name}
                    placeholder='Enter Name'
                    onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    value={email}
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
            </Form.Group>
            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    value={password}
                    placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPpassword' className='my-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type='password'
                    value={confirmPassword}
                    placeholder='Confirm Password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
            </Form.Group>
            <Button
             type="submit" 
             variant='primary' 
             className='mt-2'
             disabled={isLoading}
             >
                Register
            </Button>
            { isLoading && <Loader /> }
        </Form>
        <Row className='py-3'>
            <Col>
                Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen;