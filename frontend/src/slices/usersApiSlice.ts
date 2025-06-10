import {USERS_URL} from "../constants.ts";
import { apiSlice } from "./apiSlice.ts";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({ //post request
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body: data,
                credentials: 'include',
            }),
            // keepUnusedDataFor: 5
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST"
            })
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
                credentials: 'include',
            })
        })
    })
});

export const {useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation} = usersApiSlice;