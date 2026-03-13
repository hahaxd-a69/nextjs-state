import { fakeStoreApi } from "../counter/api/api";
import { ProductResponse } from "@/lib/Types/product-Types";

export const productApi = fakeStoreApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductResponse[], void>({
      query: () => "/products",
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
