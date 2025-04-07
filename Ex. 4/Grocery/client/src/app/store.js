import { configureStore } from "@reduxjs/toolkit"
import apiSlice from "./apiSlice"
import authReducer from "./auth/authSlice"
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: (defaultMiddleware) => defaultMiddleware().concat(apiSlice.middleware),
    // devTools: process.env.NODE_ENV !== 'production',
    devTools: true,

});




export default store;
