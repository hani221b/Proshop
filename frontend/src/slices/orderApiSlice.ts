import { apiSlice } from "./apiSlice.ts";
import { ORDERS_URL, PAYPAL_URL, PAYMENT_URL } from "../constants.ts";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
              url: ORDERS_URL,
              method: 'POST',
              body: {...order},
              credentials: 'include'
            }),
          }),
          getOrderDetails: builder.query({
            query: (orderId) => ({
              url: `${ORDERS_URL}/${orderId}`,
            }),
            keepUnusedDataFor: 5
          }),
          payOrder: builder.mutation({
            query: ({orderId, details}) => ({
              url: `${ORDERS_URL}/${orderId}/pay`,
              method: "PUT",
              body: {...details},
              credentials: 'include'
            }) 
          }),
          redirectToCheckout: builder.query({
            query: ({orderId, details}) => ({
              url: `${PAYMENT_URL}/checkout`,
              method: "GET",
              // body: {...details},
              credentials: 'include'
            }) 
          }),
          getPayPalClientId: builder.query({
            query: () => ({
              url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5
          }),
          getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
                credentials: 'include'
            }),
            keepUnusedDataFor: 5
          })
    })
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery, useLazyRedirectToCheckoutQuery,
              usePayOrderMutation, useGetPayPalClientIdQuery, useGetMyOrdersQuery} 
        = orderApiSlice;