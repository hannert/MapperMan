import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as turf from '@turf/turf';
import * as L from 'leaflet';
import 'leaflet-editable';
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
    layerGroup : L.layerGroup(),
    mergeArray: [],
    mergedFeature: null
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
        startMergeTool: (state, action) => {
            console.log('Attaching onClick for merge button');
            state.layerGroup.eachLayer(function(layer){
                layer.on({
                    'click': function(e) {
                        action.payload(e)
                    
                    }
                });
                if(state.mergeArray.includes(layer._leaflet_id)){
                    layer.setStyle({fillColor: '#CD544F'})
                } else{
                    layer.setStyle({fillColor: '#3388FF'})
                }
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
                // Reset array colors if there was a merge selected
                layer.setStyle({fillColor: '#3388FF'}) 
            });     
            
            state.editTool = null;
            state.mergeArray = []; // Reset mergeArray when clicking out of merge
        },
        setLayerGroup(state, action){
            state.layerGroup = action.payload;
        },
        setFeatureClicked: (state, action) =>{
            state.featureClicked = action.payload;
            console.log("feature in store: ", state.featureClicked);
        },
        setFeatureIndexClicked: (state, action) =>{
            state.featureClickedIndex = action.payload;
            console.log("feature Index in store: ", state.featureClickedIndex);
        },
        setMergeArray: (state, action) =>{
            state.mergeArray = action.payload;
            console.log("mergeArray in store: ", state.mergeArray);
        },
        mergeRegion: (state, action) =>{
            let geometryFirst = state.layerGroup.getLayer(state.mergeArray[0]).toGeoJSON();
            let geometrySecond = state.layerGroup.getLayer(state.mergeArray[1]).toGeoJSON();
            
            state.layerGroup.removeLayer(state.mergeArray[0])
            state.layerGroup.removeLayer(state.mergeArray[1])
            console.log("Removed old region")
            console.log("geoFirst", geometryFirst)
            console.log('geoSecon', geometrySecond)
            let mergedFeature = turf.union(
                geometryFirst, 
                geometrySecond
            )
            state.layerGroup.addLayer(L.GeoJSON.geometryToLayer(mergedFeature))
            state.mergeArray = []
        },
        finishMergeRegion: (state, action ) => {
            console.log("Finishing merge region")
            state.mergedFeature = null
            state.mergeArray = []
        }
    }
});

export const { setPrevGeoJSON, setCurrentGeoJSON, setInitialized, setEditTool, setMapRef,
startPolylineDraw, endPolylineDraw, unselectTool, setLayerGroup, setFeatureClicked, setFeatureIndexClicked,
startMouseTool, setMergeArray, mergeRegion, finishMergeRegion, startMergeTool} = leafletEditing.actions;
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
