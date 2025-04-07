import apiSlice from "../apiSlice";
import { setCredentials, logout } from "./authSlice"
const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation({
            query: (supplierData) => ({
                url: "/api/auth/register",
                method: "POST",
                body: supplierData
            }), async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    if (data.accessToken) {
                        dispatch(setCredentials({ accessToken: data.accessToken }))
                    }
                } catch (err) {
                    console.log(err)
                }
            },
        }),
        login: build.mutation({
            query: (supplierData) => ({
                url: "/api/auth/login",
                method: "POST",
                body: supplierData

            }), async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    if (data.accessToken) {
                        //בגלל שהפעולה בסטור מקבלת אותו כאובייקט צריך לשלוח אותו כאובייקט
                        dispatch(setCredentials({ accessToken: data.accessToken }))
                    }
                } catch (err) {
                    console.log(err)
                }
            },
        }),
        sendLogout: build.mutation({
            query: () => ({
                url: "/api/auth/logout",
                method: "POST"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logout())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            },

        }),
        refresh: build.mutation({
            query: () =>({
                url: "/api/auth/refresh",
                method: "GET"
            }),
            async onQueryStarted( arg,  { dispatch,   queryFulfilled }) {
                try {
                    const { data } =  await queryFulfilled
                    if(data.accessToken){
                        dispatch(setCredentials({accessToken: data.accessToken}))
                    }
                } catch (err) {
                    console.log(err)
                }
            },

        }),
      

    })
})

export const {useRegisterMutation, useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice