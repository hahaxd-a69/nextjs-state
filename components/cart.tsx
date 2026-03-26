"use client";

import { decrement, increment } from "@/lib/features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Card() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section>
      <p>calling globle state: {count}</p>
      <button
        className="border rounded-xs p-0.5"
        onClick={() => dispatch(increment())}
      >
        increment
      </button>
      <button
        className="border rounded-xs p-0.5 ml-1"
        onClick={() => dispatch(decrement())}
      >
        decrement
      </button>
    </section>
  );
}
