"use client";
import { increment } from "@/lib/features/counter/conterslice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { use } from "react";

export default function Cart() {
  // Get globsl state
  const counter = useAppSelector((state) => state.counter.value);
  //  dispatch action
  const dispatch = useAppDispatch();

  return (
    <section>
      <p>Hello I am Minea: {counter}</p>
      <button
        onClick={() => dispatch(increment())}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition duration-300"
      >
        Increase Button
      </button>
    </section>
  );
}
