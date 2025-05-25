import {createSlice} from "@reduxjs/toolkit";
import {updateCart} from "../utils/cartUtils";

interface CartItem {
    id: string;
    name: string;
    qty: number;
    price: number;
    image: string;
    // Add more fields as needed
  }
  
interface ShippingAddress {
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
}

interface CartState {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod?: string;
}


const initialState = localStorage.getItem("cart") ? 
    JSON.parse(localStorage.getItem("cart") as string) : {
        cartItems: [],
        shippingAddress: {},
        paymentMethodC: "PayPal"
    };


const cartSlice = createSlice({
    name: "cart",
    initialState, 
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x: any) => x.id === item.id);
            if(existItem) {
                state.cartItems = state.cartItems.map((x: any) =>
                         x.id === existItem.id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item: any) => item.id !== action.payload);
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
        clearCartItems: (state) => {
            state.cart = [];
            return updateCart(state);
        }
    }
});

export const { addToCart, removeFromCart,
         saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;

export default cartSlice.reducer;