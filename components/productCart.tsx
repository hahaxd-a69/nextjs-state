"use client";

import { useGetProductsQuery } from "@/lib/features/product/productApi";

export default function ProductCart() {
  const { data, isLoading } = useGetProductsQuery();
  console.log("data", data);

  return isLoading ? <p>Loading...</p> : <p>Data</p>;
}
