"use client";
import { useGetProductsQuery } from "@/lib/features/product/productApi";

export default function ProductCart() {
  // This list auto-refetches whenever addProduct is called 🔄
  const { data, isLoading, isError, isFetching } = useGetProductsQuery();

  if (isLoading)
    return <p className="text-sm text-zinc-400">Loading products…</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load products.</p>;

  return (
    <section>
      <h2 className="text-base font-bold mb-2">
        Products{" "}
        {isFetching && (
          <span className="text-xs text-blue-400 font-normal">Refreshing…</span>
        )}
      </h2>
      <ul className="flex flex-col gap-1">
        {data?.map((product) => (
          <li key={product.id} className="text-sm text-zinc-600">
            <span className="font-semibold text-zinc-800">#{product.id}</span> —{" "}
            {product.title}{" "}
            <span className="text-zinc-400">${product.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
