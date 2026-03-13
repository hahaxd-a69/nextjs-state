import Cart from "@/components/cart";
import ProductCart from "@/components/productCart";
import TextCart from "@/components/text-cart";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <Cart />
        <TextCart />
        <ProductCart />
      </main>
    </div>
  );
}
