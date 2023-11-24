import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userdata: {
    username: "",
    password: "",
    _id: "",
    full_name: "",
    address: "",
    phone_number: "",
    email: "",
    is_library_manager: true,
    created_at: "",
    updated_at: "",
  },
  isAuth: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    authUser: (state, actions) => {
      state.userdata = {
        ...actions.payload.dataToSend,
        ...actions.payload.userDetails,
      };
      state.isAuth = true;
    },
    signout: (state) => {
      state.userdata = {
        username: "",
        password: "",
        _id: "",
        full_name: "",
        address: "",
        phone_number: "",
        email: "",
        is_library_manager: false,
        created_at: "",
        updated_at: "",
      };
      state.isAuth = false;
    },
  },
});

export const appSliceReducer = appSlice.reducer;
export const { authUser, signout } = appSlice.actions;
export const globalSelector = (state) => state.globalAppState;
