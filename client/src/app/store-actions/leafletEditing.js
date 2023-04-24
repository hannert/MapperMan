import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as turf from '@turf/turf';
import * as L from 'leaflet';
import 'leaflet-editable';
import mapApis from "../store-requests/store_requests";
import 'leaflet-path-drag';

export const editTools ={
    addVertex: 'addVertex',
    removeVertex: 'removeVertex',
    addSubregion: 'addSubregion',
    removeFeature: 'removeFeature',    
    mergeSubregions: 'mergeSubregions',
    mouse: 'mouseButton',
    polyline: 'polyline',
    polygon: 'polygon',
    marker: 'marker',
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
    layerClickedId: null,
    layerClickedEditor: null,
    activeDrawing: null,
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
            state.editTool = editTools.polyline;
            // Something is wrong with the dragging library? Won't let polyline get out of edit
            let polyline = state.mapRef.editTools.startPolyline();
            state.layerGroup.addLayer(polyline);
            state.activeDrawing = polyline;
        },
        endPolylineDraw: (state, action) => {
            console.log(state.activeDrawing);
            // Work around is to make a copy of the polyline with draggable after it's done
            // and remove the old one. Setting it with draggable true initially glitches out
            let polyline = L.polyline(state.activeDrawing.getLatLngs(), {draggable: 'true'});
            polyline.dragging.disable();

            state.layerGroup.removeLayer(state.activeDrawing);
            state.layerGroup.addLayer(polyline);

            state.mapRef.editTools.commitDrawing();
            state.mapRef.editTools.stopDrawing();
            state.editTool = null;
        },
        startPolygonDraw: (state, action) => {
            state.editTool = editTools.polygon;
            let polygon = state.mapRef.editTools.startPolygon();
            state.layerGroup.addLayer(polygon);
            state.activeDrawing = polygon;
        },
        endPolygonDraw: (state, action) => {
            console.log(state.activeDrawing);
            let polygon = L.polygon(state.activeDrawing.getLatLngs(), {draggable: 'true'});
            polygon.dragging.disable();

            state.layerGroup.removeLayer(state.activeDrawing);
            state.layerGroup.addLayer(polygon);

            state.mapRef.editTools.commitDrawing();
            state.mapRef.editTools.stopDrawing();
            state.editTool = null;
        },
        startMarker: (state, action) => {
            state.editTool = editTools.marker;
            let marker = state.mapRef.editTools.startMarker();
            state.layerGroup.addLayer(marker);
        },
        endMarker: (state, action) => {
            state.mapRef.editTools.stopDrawing();
            state.editTool = null;
        },
        
        startDeletionTool: (state, action) => {
            
        },
        startMouseTool: (state, action) =>{
            console.log('Attaching onClick');
            state.layerGroup.eachLayer(function(layer){
                layer.on({
                    'click': action.payload
                });
            });    
        },
        setDraggable(state, action){
            state.layerGroup.getLayer(action.payload).dragging.enable()
        },
        unsetDraggable(state, action){
            state.layerGroup.getLayer(action.payload).dragging.disable();
        },
        /**
         * _leaflet_id of the layer selected
         * @param {*} state 
         * @param {*} action payload is the leaflet id
         */
        setLayerClickedId: (state, action) => {
            state.layerClickedId = action.payload;
        },
        /**
         * Sets the editor in redux to the editor of the layer selected. Editor
         * is a leaflet-editable class. Polygon editor in all cases for now
         * @param {} state 
         * @param {*} action payload is the editor of the layer
         */
        setLayerClickedEditor: (state, action) => {
            state.layerClickedEditor = action.payload;
        },
        /**
         * Start tracking the mouse over the whole map
         * @param {} state 
         * @param {*} action payload is a function to do something on click
         */
        startMouseTracking(state, action){    
            // state.layerGroup.eachLayer(function(layer){
            //     layer.on({
            //         'mousemove': (e)=>{
            //             console.log(e.latlng);
            //         }
            //     });
            // });
            state.mapRef.addEventListener('click', action.payload);
        },
        stopMouseTracking(state, action){
            state.mapRef.off('click');
        },
        addVertex(state, action){
            console.log(state.layerClickedEditor);
            state.layerClickedEditor.push(action.payload);
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
 startMouseTracking, setLayerClickedId, setLayerClickedEditor, addVertex, stopMouseTracking,
setDraggable, unsetDraggable, startPolygonDraw, endPolygonDraw, startMarker, endMarker, 
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

export const deleteMapPropertyThunk = createAsyncThunk('/map/:id/deleteProperty', async(payload, {rejectWithValue}) => {
    console.log("id sent to deleteProperty thunk: " + payload.id)
    try{
        const response = await mapApis.deleteMapProperty(payload.id, payload.index, payload.property);
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});
