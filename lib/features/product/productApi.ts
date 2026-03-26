import { ProductResponse } from "@/lib/Types/product-Types";
import { fakeStoreApi } from "../api/api";

export const productApi = fakeStoreApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse[], void>({
      query: () => "/products",
      providesTags: ["products"],
    }),
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: ["products"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

// export hooks for ui component can use it
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
} = productApi;
