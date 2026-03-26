"use client";
import {
  useAddProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/lib/features/product/productApi";

export default function ProductsCard() {
  const { data, isLoading } = useGetProductsQuery();
  console.log("data: ", data);

  const { data: byId, isLoading: pById } = useGetProductByIdQuery(4);
  console.log("by id: ", byId);

  // post----------------------------------------
  const [
    addProduct,
    { isLoading: postLoading, isSuccess: postSuccess, error },
  ] = useAddProductMutation();

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        title: "laptop",
        price: 300,
        description: "nice laptop",
        categoryId: 2,
        images: ["https://api.escuelajs.co/api/v1/files/e3d4.png"],
      };

      const result = await addProduct(newProduct).unwrap();

      console.log("Product created:", result);
    } catch (err) {
      console.log("Failed to create product:", err);
    }
  };
  // --------------------------------------------
  return (
    <>
      <p>
        Get all product :{" "}
        {isLoading ? "product loading......" : "get product successfully."}
      </p>
      <p>
        Get product by id :{" "}
        {pById ? "product loading......" : "get successfully."}
      </p>

      {/* button post */}
      <div>
        <button className="border rounded-xs p-1" onClick={handleAddProduct}>
          {postLoading
            ? "Adding..."
            : postSuccess
              ? "Add product success"
              : "Add Product"}
        </button>

        {postSuccess && <p>Product added successfully</p>}
        {error && <p>Something went wrong</p>}
      </div>
    </>
  );
}
