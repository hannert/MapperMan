import * as L from 'leaflet';
import 'leaflet-editable';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mapApis from "../store-requests/store_requests";

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
    featureClickedIndex:null,
    editTool: null,
    mapRef: null,
    layerGroup : L.layerGroup()
}

export const leafletEditing = createSlice({
    name: 'leafletEditing',
    initialState,
    reducers: {
        /**
         * If there is a current geoJSON object, set it as the previous geoJSON object.
         * This is needed to remove previous geoJSON user clicked from map and display
         * a new one
         * @param {} state 
         * @param {*} action 
         */
        setPrevGeoJSON: (state, action) => {
            if(this.currentGeoJSON !== null){
                state.prevGeoJSON = this.currentGeoJSON
            }
        },
        /**
         * Set geoJSON object that was uploaded
         * @param {*} state 
         * @param {*} action 
         */
        setCurrentGeoJSON: (state, action) => {
            state.currentGeoJSON = action.payload;
        },
        /**
         * Needed for edit tools to be used one at a time
         * @param {*} state 
         * @param {*} action payload will be one of the edit tools in editTools
         */
        setEditTool: (state, action) => {
            console.log('Setting edit tool: ' + action.payload);
            state.editTool = action.payload;
        },
        /**
         * 
         * @param {*} state 
         * @param {*} action Action.payload is a leaflet instance
         */
        setMapRef: (state, action) => {
            state.mapRef = action.payload;
            console.log('Mapref in store');
            console.log(state.mapRef);
        },
        startPolylineDraw: (state, action) => {
            state.mapRef.editTools.startPolyline();
        },
        endPolylineDraw: (state, action) => {
            state.mapRef.editTools.commitDrawing();
            state.mapRef.editTools.stopDrawing();
        },
        startMouseTool: (state, action) =>{
            console.log('Attaching onClick');
            state.layerGroup.eachLayer(function(layer){
                layer.on({
                    'click': function(e){
                        if(e.target.editEnabled()){
                            e.target.disableEdit();
                        }else{
                            e.target.enableEdit();
                        }
                    }
                });
            });            
        },
        /**
         * Delete a path shape at a given latlng point
         * @param {*} state 
         * @param {*} action Has to be a latlng point of some shape
         */
        deleteSubregion: (state, action) => {
            state.mapRef.editTools.deleteShapeAt(action.payload);
        },
        unselectTool: (state, action) => {
            state.layerGroup.eachLayer(function(layer){
                layer.off(
                    'click'
                );
            });     
            state.editTool = null;
        },
        setLayerGroup(state, action){
            state.layerGroup = action.payload;
        },
        setFeatureClicked: (state, action) =>{
            state.featureClicked = action.payload;
            console.log("feature in store: ");
            console.log(state.featureClicked)
        },
        setFeatureIndexClicked: (state, action) =>{
            state.featureClickedIndex = action.payload;
            console.log("feature Index in store: ");
            console.log(state.featureClickedIndex);
        }
    }
});

export const { setPrevGeoJSON, setCurrentGeoJSON, setInitialized, setEditTool, setMapRef,
startPolylineDraw, endPolylineDraw, unselectTool, setLayerGroup, setFeatureClicked, setFeatureIndexClicked,
startMouseTool } = leafletEditing.actions;
export default leafletEditing.reducer;


export const editMapPropertyThunk = createAsyncThunk('/map/:id/editProperty', async(payload, {rejectWithValue}) => {
    console.log("id sent to editProperty thunk: " + payload.id)
    try{
        const response = await mapApis.editMapProperty(payload.id, payload.index, payload.property, payload.value);
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});
