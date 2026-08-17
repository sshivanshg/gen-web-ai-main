// /* eslint-disable no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";

export const store = configureStore({
    reducer: {
        user: userSlice,
    },
});
