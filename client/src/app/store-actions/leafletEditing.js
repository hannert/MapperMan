import { createSlice } from "@reduxjs/toolkit";

export const editTools ={
    addVertex: 'addVertex',
    removeVertex: 'removeVertex',
    addSubregion: 'addSubregion',
    removeSubregion: 'removeSubregion',    
    mergeSubregions: 'mergeSubregions',
    mouse: 'mouseButton',
    polyline: 'polyline',
}

const initialState = {
    initialized: false,
    prevGeoJSON: null,
    currentGeoJSON: null,
    featureClicked: null,
    editTool: null,
    mapRef: null
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
        },
        setEditTool: (state, action) => {
            state.editTool = action.payload;
        },
        setMapRef: (state, action) => {
            state.mapRef = action.payload;
            console.log('Mapref in store');
            console.log(state.mapRef);
        }
    }
});

export const { setPrevGeoJSON, setCurrentGeoJSON, setInitialized, setEditTool, setMapRef } = leafletEditing.actions;
export default leafletEditing.reducer;