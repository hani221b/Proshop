import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import store from './store';
import {Provider} from "react-redux";
import CartScreen from './Screens/CartScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
        <Route path='/' index={true} element={<HomeScreen />} />
        <Route path='/product/:id'  element={<ProductScreen />} />
        <Route path='/cart'  element={<CartScreen />} />
        <Route path='/login'  element={<LoginScreen />} />
        <Route path='/register'  element={<RegisterScreen />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
       <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
