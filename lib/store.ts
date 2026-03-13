import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/conterslice";
import { productApi } from "./features/product/productApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
