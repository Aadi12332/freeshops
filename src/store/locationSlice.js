/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latitude: sessionStorage.getItem("latitude") || null,
  longitude: sessionStorage.getItem("longitude") || null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    SET_LOCATION: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;

      // Save to sessionStorage
      sessionStorage.setItem("latitude", action.payload.latitude);
      sessionStorage.setItem("longitude", action.payload.longitude);
    },
    CLEAR_LOCATION: (state) => {
      state.latitude = null;
      state.longitude = null;
      sessionStorage.removeItem("latitude");
      sessionStorage.removeItem("longitude");
    },
  },
});

export const { SET_LOCATION, CLEAR_LOCATION } = locationSlice.actions;
export const selectLatitude = (state) => state.location.latitude;
export const selectLongitude = (state) => state.location.longitude;

export default locationSlice.reducer;
