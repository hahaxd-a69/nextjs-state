import { fakeStoreApi } from "../counter/api/api";
import { ProductResponse, CreateProductInput } from "@/lib/Types/product-Types";

export const productApi = fakeStoreApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /products  — auto-refetches when "Products" tag is invalidated
    getProducts: build.query<ProductResponse[], void>({
      query: () => "/products",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products" as const, id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // GET /products/:id  — auto-refetches this specific product
    getProductById: build.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Products", id }],
    }),

    // POST /products  — invalidates the list so it auto-refetches
    addProduct: build.mutation<ProductResponse, CreateProductInput>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
} = productApi;
