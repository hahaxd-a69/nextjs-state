import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: { id: number; name: string; image: string };
  images: string[];
};

type NewProduct = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

type UpdateProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // GET /api/products
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    // GET /api/products/:id
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // POST /api/products
    addProduct: builder.mutation<Product, NewProduct>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // PUT /api/products/:id — optimistic update
    updateProduct: builder.mutation<Product, UpdateProduct>({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(
        { id, title, price, description },
        { dispatch, queryFulfilled },
      ) {
        // Patch the local cache immediately so UI updates without waiting for API
        const patchResult = dispatch(
          productApi.util.updateQueryData("getProducts", undefined, (draft) => {
            const product = draft.find((p) => p.id === id);
            if (product) {
              product.title = title;
              product.price = Number(price); // ensure number, not string
              product.description = description;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          // API failed — revert the optimistic change
          patchResult.undo();
        }
      },
    }),

    // DELETE /api/products/:id — optimistic delete
    deleteProduct: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData("getProducts", undefined, (draft) => {
            return draft.filter((product) => product.id !== id);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
