import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/UserSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
  }
});

export default store;
