import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import swapReducer from "../store/swap/swapSlice";
import coinDataReducer from "../store/coinData/coinSlice";

const store = configureStore({
  reducer: {
    swap: swapReducer,
    coinData: coinDataReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export const dispatch = store.dispatch;
export default store;
