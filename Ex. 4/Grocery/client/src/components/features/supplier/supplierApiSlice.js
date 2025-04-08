import apiSlice from "../../../app/apiSlice";

const supplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllSuppliers: build.query({
            query: () => ({
                url: "api/suppliers"
            }),
            providesTags: ["suppliers"]
        }),
        getSupplier: build.query({
            query: (id) => ({
                url: `api/suppliers/${id}`,
                method: "GET",
            }),
            providesTags: ["suppliers"],
        }),
        registerSupplier: build.mutation({
            query: (supplierData) => ({
                url: "/api/auth/register",
                method: "POST",
                body: supplierData,
            }),
            invalidatesTags: ["suppliers"]
        }),
        getSupplierProducts: build.query({
            query: (supplierId) => ({
                url: `/api/suppliers/${supplierId}/products`,
                method: "GET"
            }),
            providesTags: ["Products"]
        }),
    }),
});

export const { useRegisterSupplierMutation,
    useGetAllSuppliersQuery,
    useGetSupplierQuery,
    useGetSupplierProductsQuery } = supplierApiSlice;
export default supplierApiSlice;

