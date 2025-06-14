import { CartItem } from "../@types/cart";

export const addDecimals = (num: number) => {
    return (Math.round(num * 100) /100).toFixed(2);
}

export const updateCart = (state: any) => {
        //calculate items price
        state.itemPrice = addDecimals(state.cartItems.reduce((acc: number, item: CartItem ) =>
            acc + item.price + item.qty, 0));
        //calculate shipping price
        state.shippingPrice = addDecimals(state.itemPrice > 100 ? 0 : 10);
        //calculate tax price
        state.taxPrice = addDecimals(Number((0.15 * state.itemPrice).toFixed(2)));
        //calculate total price
        state.totalPrice = (
            Number(state.itemPrice) + 
            Number(state.shippingPrice) +
            Number(state.taxPrice) 
        ).toFixed(2);

        localStorage.setItem("cart", JSON.stringify(state));

        return state;
}