// define Type or Interfsce

import { createSlice } from "@reduxjs/toolkit/react";

export interface CounterState {
  value: number;
}

// define initialState
const initialState: CounterState = {
  value: 10,
};

// define Reduce
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

//export Action of Reducer
export const { increment, decrement } = counterSlice.actions;

//Export Reducer
export default counterSlice.reducer;
