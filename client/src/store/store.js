import { configureStore } from "@reduxjs/toolkit";
import { roleReducer } from "./roleSlice";
import { userReducer } from "./userSlice";

const store = configureStore({
    reducer :{
        roleState : roleReducer,
        userState: userReducer,
    }
});

export default store;