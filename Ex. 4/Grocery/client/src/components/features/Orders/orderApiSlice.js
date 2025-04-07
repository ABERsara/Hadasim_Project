import apiSlice from "../../../app/apiSlice";

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllorders: build.query({
            query: () => ({
                url: `/api/orders` 
            }),
            providesTags: ["Orders"]
        }),
        addOrder: build.mutation({
            query: (order) => ({
                url: "/api/orders",
                method: "POST",
                body: order
            }),
            invalidatesTags: ["Orders"]
        }),
        getSingleOrder: build.query({
            query: (_id) => ({
                url: `/api/orders/${_id}`,
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),
       updateStatusOrder: build.mutation({
            query: ({order }) => ({
                url: `api/orders/status`,
                method: "PUT",
                body:order
            }),
            invalidatesTags:["Orders"]
        })
    })

})

export const { 
useAddOrderMutation,
useGetAllordersQuery,
useGetSingleOrderQuery,
useUpdateStatusOrderMutation
} = ordersApiSlice 