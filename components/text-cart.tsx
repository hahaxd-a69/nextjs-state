"use client";
import { useAppSelector } from "@/lib/hooks";
import Cart from "./cart";

export default function TextCart() {
  // Get globsl state
  const counter = useAppSelector((state) => state.counter.value);

  return (
    <section>
      <p>more another: Hello I am Minea: {counter}</p>
    </section>
  );
}
