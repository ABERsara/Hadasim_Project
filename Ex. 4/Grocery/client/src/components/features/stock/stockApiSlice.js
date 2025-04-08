import apiSlice from "../../../app/apiSlice";

const stockApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllStockItems: build.query({
            query: () => ({
                url: `/api/stock`
            }),
            providesTags: ["Stock"]
        }),
        addStockItem: build.mutation({
            query: (stockItem) => ({
                url: "/api/stock",
                method: "POST",
                body: stockItem
            }),
            invalidatesTags: ["Stock"]
        }),
        getStockItem: build.query({
            query: (_id) => ({
                url: `/api/stock/${_id}`,
                method: "GET"
            }),
           providesTags: ['Stock']
        }),
        linkSupplierToStockItem: build.mutation({
            query: ({ stockItemId, linkData }) => ({
                url: `/api/stock/${stockItemId}/link-supplier`,
                method: "POST",
                body: linkData
            }),
            invalidatesTags: ["Stock"]
        }),
        processSales: build.mutation({ 
            query: (salesData) => ({
                url: `/api/sales/process`,
                method: "POST",
                body: salesData
            }),
            invalidatesTags: ["Stock", "Orders"] 
        })
    })
});

export const {
    useGetAllStockItemsQuery,
    useAddStockItemMutation,
    useGetStockItemQuery,
    useLinkSupplierToStockItemMutation,
    useProcessSalesMutation
} = stockApiSlice;