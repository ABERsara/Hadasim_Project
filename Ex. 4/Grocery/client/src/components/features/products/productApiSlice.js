import apiSlice from "../../../app/apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllProducts: build.query({
            query: () => ({
                url: `/api/products` 
            }),
            providesTags: ["Products"]
        }),
        addProduct: build.mutation({
            query: (product) => ({
                url: "/api/products",
                method: "POST",
                body: product
            }),
            invalidatesTags: ["Products"]
        }),
        getSingleProduct: build.query({
            query: (_id) => ({
                url: `/api/products/${_id}`,
                method: "GET"
            }),
            providesTags: ["Products"]
        }),
      
    })

})

export const { 
useAddProductMutation,
useGetAllProductsQuery,
useGetSingleProductQuery
} =productApiSlice 