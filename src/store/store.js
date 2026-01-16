/** @format */

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import locationReducer from './locationSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    location: locationReducer,
  },
});