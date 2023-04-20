import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    prevGeoJSON: null,
    currentGeoJSON: null,
    featureClicked: null,
}

export const leafletEditing = createSlice({
    name: 'leafletEditing',
    initialState,
    reducers: {
        setPrevGeoJSON: (state, action) => {
            state.prevGeoJSON = action.payload;
        },
        setCurrentGeoJSON: (state, action) => {
            state.currentGeoJSON = action.payload;
        }
    }
});

export const { setPrevGeoJSON, setCurrentGeoJSON } = leafletEditing.actions;
export default leafletEditing.reducer;