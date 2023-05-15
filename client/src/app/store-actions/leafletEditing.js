import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import * as turf from '@turf/turf';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import mapApis from "../store-requests/store_requests";
import jsTPS from "../jsTPS/jsTPS";

export const editTools ={
    addVertex: 'addVertex',
    removeVertex: 'removeVertex',
    addSubregion: 'addSubregion',
    removeFeature: 'removeFeature',    
    mergeSubregions: 'mergeSubregions',
    mouse: 'mouseButton',
    polyline: 'polyline',
    polygon: 'polygon',
    circle: 'circle',
    marker: 'marker',
    tps: null
}

export const shapes = {
    polygon: 'polygon',
    polyline: 'polyline',
}

const initialState = {
    initialized: false,
    prevGeoJSON: null,
    currentGeoJSON: null,
    featureClicked: null,
    featureClickedIndex:null,
    featureIndex: 0,
    properties: null,
    editTool: null,
    mapRef: null,
    layerGroup : L.layerGroup(),
    layerClickedId: null,
    layerClickedEditor: null,
    activeDrawing: null,
    mergeArray: [],
    mergedFeature: null,
    chosenForDeletion: null,
    collaborators: [],
    sharedWith: [],
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
            let polyline = state.mapRef.editTools.startPolyline(undefined, {draggable: true});
            state.featureIndex += 1;
            polyline.featureIndex = state.featureIndex;
            // polyline.shape = shapes.polyline;
            // in stack with create polyline transaction
            polyline.dragging.disable();

            state.layerGroup.addLayer(polyline);
            state.activeDrawing = polyline;
        },
        /**
         * Deprecated
         */
        endPolylineDraw: (state, action) => {

            // console.log(state.activeDrawing);
            // // Work around is to make a copy of the polyline with draggable after it's done
            // // and remove the old one. Setting it with draggable true initially glitches out
            // let polyline = L.polyline(state.activeDrawing.getLatLngs(), {draggable: 'true'});
            // polyline.dragging.disable();

            // polyline.featureIndex = state.featureIndex;
            // state.properties[state.featureIndex] = {name: 'New Polyline'};
            // state.featureIndex += 1;

            // state.layerGroup.removeLayer(state.activeDrawing);
            // state.layerGroup.addLayer(polyline);

            // state.mapRef.editTools.commitDrawing();
            // state.mapRef.editTools.stopDrawing();
            // state.editTool = null;
        },
        startPolygonDraw: (state, action) => {
            state.editTool = editTools.polygon;
            let polygon = state.mapRef.editTools.startPolygon(undefined, {draggable: true});
            state.featureIndex += 1;
            polygon.featureIndex = state.featureIndex;
            
            // somehow giving it a shape property makes code break honestly idk y
            // polygon.shape = shapes.polygon;
            // polygon.shape = 'polygon'
            // in stack with create polygon transaction

            polygon.dragging.disable();

            state.layerGroup.addLayer(polygon);
            state.activeDrawing = polygon;

        },
        /**
         * Deprecated
         */
        endPolygonDraw: (state, action) => {
            // console.log(state.activeDrawing);
            // let polygon = L.polygon(state.activeDrawing.getLatLngs(), {draggable: 'true'});
            // polygon.dragging.disable();

            // polygon.featureIndex = state.featureIndex;
            // state.properties[state.featureIndex] = {name: 'New Polygon'};
            // state.featureIndex += 1;
            // state.layerGroup.removeLayer(state.activeDrawing);
            // state.layerGroup.addLayer(polygon);

            // state.mapRef.editTools.commitDrawing();
            // state.mapRef.editTools.stopDrawing();
            // state.editTool = null;
        },
        startCircleDraw: (state, action) => {
            state.editTool = editTools.circle;
            let circle = state.mapRef.editTools.startCircle();
            state.layerGroup.addLayer(circle);
            state.activeDrawing = circle;
        },
        endCircleDraw: (state, action) => {
            // console.log(state.activeDrawing);
            // let circle = L.circle(state.activeDrawing._latlng, state.activeDrawing.getRadius(), {draggable: 'true'});
            // circle.dragging.disable();

            // state.layerGroup.removeLayer(state.activeDrawing);
            // state.layerGroup.addLayer(circle);
            state.activeDrawing.disableEdit();
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
        startRemoveTool: (state, action) =>{
            state.layerGroup.eachLayer(function(layer){
                layer.off(
                    'click'
                );
            });
            console.log('Attaching onClick');
            state.layerGroup.eachLayer(function(layer){
                layer.on({
                    'click': action.payload
                });
            });
        },
        setChosenForDeletion: (state, action) => {
            //idk how but at some point this gets called and messes things up so commenting out
            // state.chosenForDeletion = action.payload;
        },
        removeFeature: (state, action) => {
            console.log('Removing feature');
            console.log(action.payload);
            console.log(state.layerClickedEditor);      
        },
        mouseToolAction: (state, action) =>{
            if(state.editTool === editTools.mouse){
                console.log('Attaching onClick');
                let feature = null;
                for(let layer of state.layerGroup.getLayers()){
                    if(layer.featureIndex === state.featureClickedIndex){
                        feature = layer;
                    }
                }
                console.log(feature);
                console.log(state.editTool);

                console.log('Mouse tool action');
                // console.log(feature.editor._enabled)
                console.log(feature.editEnabled());

                if(feature.editEnabled()){
                    feature.setStyle({ color: "#3388ff" });
                    feature.toggleEdit();
                }else{
                    feature.setStyle({ color: "black" });
                    feature.toggleEdit();
                    console.log('Enabling edit');
                    console.log(feature.editEnabled())
                    if(feature._latlngs.length !== 1){
                        state.layerGroup.getLayer(feature._leaflet_id).dragging.disable()
                    }
                }
            }

        },
        removeToolAction: (state, action) =>{
            if(state.editTool === editTools.removeFeature){
                let feature = null;

                for(let layer of state.layerGroup.getLayers()){
                    if(layer.featureIndex === state.featureClickedIndex){
                        feature = layer;
                    }
                }
                console.log(state.editTool);
                console.log('Remove tool action');
                console.log(feature);
                state.chosenForDeletion = feature;

                state.layerGroup.removeLayer(feature);
            }
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
            state.mapRef.addEventListener('click', action.payload);
        },
        stopMouseTracking(state, action){
            state.mapRef.off('click');
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
        unselectTool: (state, action) => {
            console.log('Unselecting tool');
            
            //TODO this def broke merge tool so need to look at it later, can uncomment this to fix it

            // state.layerGroup.eachLayer(function(layer){
            //     layer.off(
            //         'click'
            //     );
            //     // Reset array colors if there was a merge selected
            //     // Idk y this sometimes breaks 
            //     // layer.setStyle({fillColor: '#3388FF'})
            // });     
            state.editTool = null;
            state.layerClickedId = null;
            state.mergeArray = []; // Reset mergeArray when clicking out of merge
            console.log('Tool unselected');
        },
        setLayerGroup(state, action){
            state.layerGroup = action.payload;
        },
        setFeatureClicked: (state, action) =>{
            state.featureClicked = action.payload;
            console.log("feature in store: ", state.featureClicked);
        },
        /**
         * Index given in our app
         * @param {*} state 
         * @param {*} action 
         */
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
            
            /**Set these to true so the listener in the container doesnt pick it up */
            state.layerGroup.getLayer(state.mergeArray[0]).inStack = true;
            state.layerGroup.getLayer(state.mergeArray[1]).inStack = true;


            state.layerGroup.removeLayer(state.mergeArray[0])
            state.layerGroup.removeLayer(state.mergeArray[1])
            console.log("Removed old region")
            console.log("geoFirst", geometryFirst)
            console.log('geoSecon', geometrySecond)
            let mergedFeature = turf.union(
                geometryFirst, 
                geometrySecond, 
            )

            let polygon = L.polygon(L.GeoJSON.geometryToLayer(mergedFeature.geometry)._latlngs, {draggable:true});
            polygon.featureIndex = state.featureIndex;
            state.featureIndex += 1;
            state.properties[state.featureIndex] = {name: 'New Merged Region'};

            state.layerGroup.addLayer(polygon);
            state.mergeArray = []
        },
        finishMergeRegion: (state, action ) => {
            console.log("Finishing merge region")
            state.mergedFeature = null
            state.mergeArray = []
        },
        //TODO bandaid fix
        setFeatureIndex: (state, action) => {
            state.featureIndex = action.payload;
        },

        incrementFeatureIndex: (state, action) => {
            state.featureIndex += 1;
        },
        setProperties: (state, action) => {
            state.properties = action.payload;
        },
        setCollaborators: (state, action) => {
            state.collaborators = action.payload;
        },
        setSharedWith: (state, action) => {
            state.sharedWith = action.payload;
        },
        /**Adds a new feature to the geoJSON */
        updateProperties: (state, action) => {
            state.properties.push(action.payload.properties);
        },
        applyDelta: (state, action) =>{
            let jsondiffpatch = require('jsondiffpatch').create();
            console.log("applying delta: ", action.payload);
            jsondiffpatch.patch(state.currentGeoJSON, action.payload);
            // state.properties=state.currentGeoJSON.features[state.featureIndex].properties
            console.log(JSON.stringify(state.currentGeoJSON.features))
            let properties = [];
            let index=0;
            //**Im just gonna copy this from leaflet container for now: */
            for(let feature of state.currentGeoJSON.features){
                properties.push(state.currentGeoJSON.features[index].properties);
                index += 1;
            }
            state.properties = properties;
        },
        emitPropertyChange: (state,action)=>{
            let socket = action.payload.socket;
            let room = action.payload.currMapId;
            let featureIndex = state.featureClickedIndex;
            let key = action.payload.key;
            let value = action.payload.value;
            let type = action.payload.type
            console.log("emitting:")
            console.log(socket.emit('edit properties', room, featureIndex, key, value, type));
        },
        editPropertyValue: (state, action) =>{
            // let key = action.payload.key;
            // let value = action.payload.value;
            // let featureIndex = action.payload.featureIndex;
            // state.currentGeoJSON.features[featureIndex].properties[key]=value;
            // // console.log(JSON.stringify(state.currentGeoJSON.features[featureIndex].properties))
            // let properties = [];
            // let index=0;
            // for(let feature of state.currentGeoJSON.features){
            //     properties.push(state.currentGeoJSON.features[index].properties);
            //     index += 1;
            // }
            // state.properties = properties;

            let feature = null;
            for(let layer of state.layerGroup.getLayers()){
                if(layer.featureIndex === state.featureClickedIndex){
                    feature = layer;
                }
            }

            let copy = {}
            for(let property in feature.properties){
                if(property !== action.payload.key){
                    copy[property] = feature.properties[property]
                }else{
                    copy[action.payload.key] = action.payload.value;
                }
            }
            feature.properties = copy;

        },
        deleteProperty: (state, action) =>{
            // let key = action.payload.key;
            // let featureIndex = action.payload.featureIndex;
            // delete state.currentGeoJSON.features[featureIndex].properties[key];
            // // console.log(JSON.stringify(state.currentGeoJSON.features[featureIndex].properties))
            
            // let properties = [];
            // let index=0;
            // for(let feature of state.currentGeoJSON.features){
            //     properties.push(state.currentGeoJSON.features[index].properties);
            //     index += 1;
            // }
            // state.properties = properties;

            let feature = null;
            for(let layer of state.layerGroup.getLayers()){
                if(layer.featureIndex === state.featureClickedIndex){
                    feature = layer;
                }
            }

            let copy = {}
            for(let property in feature.properties){
                if(property !== action.payload.key){
                    copy[property] = feature.properties[property]
                }
            }
            feature.properties = copy;

        },
        addProperty: (state, action) =>{
            // let key = action.payload.key;
            // let value = action.payload.value;
            // let featureIndex = action.payload.featureIndex;

            // state.currentGeoJSON.features[featureIndex].properties[key]=value;

            // let properties = [];
            // let index=0;
            // for(let feature of state.currentGeoJSON.features){
            //     properties.push(state.currentGeoJSON.features[index].properties);
            //     index += 1;
            // }
            // state.properties = properties;
            console.log('Trying to add property')
            let feature = null;
            for(let layer of state.layerGroup.getLayers()){
                if(layer.featureIndex === state.featureClickedIndex){
                    feature = layer;
                }
            }

            let copy = {}
            for(let property in feature.properties){
                copy[property] = feature.properties[property]
            }
            copy[action.payload.key] = action.payload.value;
            feature.properties = copy;

        }
        
    }
});

export const { setPrevGeoJSON, setCurrentGeoJSON, setInitialized, setEditTool, setMapRef,
startPolylineDraw, endPolylineDraw, unselectTool, setLayerGroup, setFeatureClicked, setFeatureIndexClicked,
 startMouseTracking, setLayerClickedId, setLayerClickedEditor, addVertex, stopMouseTracking,
setDraggable, unsetDraggable, startPolygonDraw, endPolygonDraw, startMarker, endMarker, 
removeToolAction,
mouseToolAction, setMergeArray, mergeRegion, finishMergeRegion, startMergeTool, removeFeature, startRemoveTool, 
setCollaborators, setSharedWith, setChosenForDeletion, startCircleDraw, endCircleDraw, incrementFeatureIndex, setProperties, 
setFeatureIndex, updateProperties, applyDelta, emitPropertyChange, editPropertyValue, deleteProperty, addProperty} = leafletEditing.actions;

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

export const saveGeojsonThunk = createAsyncThunk('/map/:id', async(payload, {rejectWithValue}) => {
    console.log("id sent to saveGeojson thunk: " + payload.id);
    try{
        const response = await mapApis.saveMap(payload.owner, payload.mapData, payload.id);
        return response.data;
    }catch(err){
        return rejectWithValue(err);
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

export const updateCollaboratorThunk = createAsyncThunk('/map/:id/deleteProperty', async(payload, {rejectWithValue}) => {
    try{
        const response = await mapApis.updateMapCollaborator(payload.id, payload.user, payload.collaborators);
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
});

// export const isValidEmailThunk = createAsyncThunk('/isValidEmail/:email', async(payload, {rejectWithValue}) => {
//     try{
//         const response = await mapApis.updateMapCollaborator(payload.email);
//         return response.data
//     }catch(err){
//         return rejectWithValue(err.response.data.errorMessage);
//     }
// });