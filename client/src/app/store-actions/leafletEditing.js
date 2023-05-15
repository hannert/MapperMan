import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as turf from '@turf/turf';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import mapApis from "../store-requests/store_requests";

export const editTools ={
    addVertex: 'addVertex',
    removeVertex: 'removeVertex',
    addSubregion: 'addSubregion',
    removeFeature: 'removeFeature',    
    mergeSubregions: 'mergeSubregions',
    splitSubregions: 'splitSubregions',
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
            polyline.split = false;
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
        startSplit: (state, action) => {
            state.editTool = editTools.splitSubregions;
            let polyline = state.mapRef.editTools.startPolyline(undefined, {draggable: true});
            state.featureIndex += 1;
            polyline.split = true;
            polyline.featureIndex = state.featureIndex;
            // polyline.shape = shapes.polyline;
            // in stack with create polyline transaction
            polyline.dragging.disable();

            state.layerGroup.addLayer(polyline);
            state.activeDrawing = polyline;

        },
        endSplit: (state, action) => { 
            console.log("ending split")
            let drawnLayer = state.activeDrawing;
            let drawnGeoJSON = drawnLayer.toGeoJSON();
            let drawnGeometry = turf.getGeom(drawnGeoJSON);
            console.log(drawnGeometry.type)

            // state.layerGroup.addLayer(drawnLayer);

            console.log(Object.entries(state.layerGroup._layers))
            console.log(drawnGeometry)
            for(let [i, container] of Object.entries(state.layerGroup._layers)){
                let polygon = state.layerGroup._layers[i];
                var cutPolygon = null;
                if(polygon instanceof L.Polygon){
                    cutPolygon = polygonCut(polygon, drawnGeometry);
                }
                console.log('CutPolygon:', cutPolygon)
                if (cutPolygon != null) {


                    turf.geomEach(cutPolygon, function (geometry) {
                        console.log(L.GeoJSON.geometryToLayer(geometry))
                        let poly = L.polygon(L.GeoJSON.geometryToLayer(geometry)._latlngs, {draggable:true, shape:'polygon'})
                        let layers = state.layerGroup._layers
                        let lastItemInLayers = layers[Object.keys(layers)[Object.keys(layers).length - 1]]
                        let newFeatureIndex = lastItemInLayers.featureIndex + 1
                        poly.dragging.disable();
                        poly.featureIndex = newFeatureIndex
                        poly.on('click', (e) => {
                            console.log("clicked newly split polyogn", e, e.sourceTarget.featureIndex) 
                            action.payload.dispatch(setFeatureIndexClicked(e.sourceTarget.featureIndex));
                            action.payload.dispatch(mouseToolAction())
                        });

                        console.log('polytype:', poly.type)
                        console.log('poly', poly)
                        state.layerGroup.addLayer(poly)

                    });
                    let room = action.payload.mapId
                    action.payload.socket.emit("split region", room, drawnGeoJSON)

                    
                }

            }

            function polygonCut(polygon, line, idPrefix) {
                // Old one should be deleted here?
                const THICK_LINE_UNITS = 'kilometers';
                const THICK_LINE_WIDTH = 0.001;
                var i, j, id, intersectPoints, lineCoords, forCut, forSelect;
                var thickLineString, thickLinePolygon, clipped, polyg, intersect;
                var polyCoords = [];
                var cutPolyGeoms = [];
                var cutFeatures = [];
                var offsetLine = [];
                var retVal = null;
                var intersectIndexArray = [];
                // console.log('polygon shape', polygon.shape)
                // console.log('line type', line.type)
        
                // if (((polygon.shape != 'polygon') && (polygon.shape != 'MultiPolygon')) || (line.type != 'LineString')) {
                //     // console.log("return ")
                //     return retVal;
                // }
                // if(polygon.instanceOf(L.Polygon) ){
                //     console.log("INSTACNE OF POLYGON")
                // }
                if((line.type != 'LineString')){
                    return retVal;
                }
                if (typeof(idPrefix) === 'undefined') {
                    idPrefix = '';
                }
                let newPolygon = null;
                try{
                    newPolygon = polygon.toGeoJSON().geometry; 
 
                } catch(e) {
                    console.log(e)
                }
                if (newPolygon === null) return
                if (line?.coordinates?.length === 0) return
                console.log(line)
                console.log('NewPolygon', newPolygon)
                intersectPoints = turf.lineIntersect(newPolygon, line);
                if (intersectPoints.features.length == 0) {
                    // console.log("return ")
                    return retVal;
                }
                
                var lineCoords = turf.getCoords(line);
                if ((turf.booleanWithin(turf.point(lineCoords[0]), newPolygon) ||
                    (turf.booleanWithin(turf.point(lineCoords[lineCoords.length - 1]), newPolygon)))) {
                    console.log("return ")
                    return retVal;
                }
        
                offsetLine[0] = turf.lineOffset(line, THICK_LINE_WIDTH, {units: THICK_LINE_UNITS});
                offsetLine[1] = turf.lineOffset(line, -THICK_LINE_WIDTH, {units: THICK_LINE_UNITS});
        
                for (i = 0; i <= 1; i++) {
                    forCut = i; 
                    forSelect = (i + 1) % 2; 
                    polyCoords = [];
                    for (j = 0; j < line.coordinates.length; j++) {
                        polyCoords.push(line.coordinates[j]);
                    }
                    for (j = (offsetLine[forCut].geometry.coordinates.length - 1); j >= 0; j--) {
                        polyCoords.push(offsetLine[forCut].geometry.coordinates[j]);
                    }
                    polyCoords.push(line.coordinates[0]);
        
                    thickLineString = turf.lineString(polyCoords);
                    thickLinePolygon = turf.lineToPolygon(thickLineString);
                    clipped = turf.difference(newPolygon, thickLinePolygon);
                    console.log(clipped)
                    cutPolyGeoms = [];
                    
                    for (j = 0; j < clipped.geometry.coordinates.length; j++) {
                        polyg = turf.polygon(clipped.geometry.coordinates[j]);
                        intersect = turf.lineIntersect(polyg, offsetLine[forSelect]);
                        if (intersect.features.length > 0) {
                            console.log("Intersecting at j of ", j)
                            intersectIndexArray.push(j);
                            cutPolyGeoms.push(polyg.geometry.coordinates);
                        };
                    };
        
                    cutPolyGeoms.forEach(function (geometry, index) {
                    id = idPrefix + (i + 1) + '.' +  (index + 1);
                    cutFeatures.push(turf.polygon(geometry, {id: id}));
                        });
                }
                console.log('End', line ,line.type)
                console.log('End',polygon, polygon.type)
                if(newPolygon.type === 'MultiPolygon'){
                    console.log("Multipolygon trying to be spit")
                    intersectIndexArray.sort()
                    console.log(polygon)
                    for(let i = intersectIndexArray.length - 1; i >= 0; i--){
                        console.log('i', i)
                        polygon._latlngs.splice(intersectIndexArray[i], 1)
                    }
                    polygon.redraw()
                } else {
                    state.layerGroup.removeLayer(polygon._leaflet_id)
                }
                
                if (cutFeatures.length > 0) retVal = turf.featureCollection(cutFeatures);
                
                return retVal;
            }

            state.layerGroup.removeLayer(drawnLayer)


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
            state.chosenForDeletion = action.payload;
        },
        removeFeature: (state, action) => {
            console.log('Removing feature');
            console.log(action.payload);
            console.log(state.layerClickedEditor);      
        },
        mouseToolAction: (state, action) =>{
            console.log('Attaching onClick');
            let feature = null;
            for(let layer of state.layerGroup.getLayers()){
                if(layer.featureIndex === state.featureClickedIndex){
                    feature = layer;
                }
            }
            console.log(feature);
            console.log(state.editTool);
            if(state.editTool === editTools.mouse){
                console.log('Mouse tool action');
                // console.log(feature.editor._enabled)
                console.log(feature.editEnabled());

                if(feature.editEnabled()){
                    feature.setStyle({ color: "#3388ff" });
                    feature.toggleEdit();
                    state.layerGroup.getLayer(feature._leaflet_id).dragging.disable()
                    console.log('Disabling edit');
                    console.log(feature.editEnabled())
                }else{
                    feature.setStyle({ color: "black" });
                    feature.toggleEdit();
                    console.log('Enabling edit');
                    console.log(feature.editEnabled())
                    state.layerGroup.getLayer(feature._leaflet_id).dragging.enable()
                }
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
            polygon.on('click', (e) => {
                console.log("clicked newly split polyogn", e, e.sourceTarget.featureIndex) 
                action.payload(setFeatureIndexClicked(e.sourceTarget.featureIndex));
                action.payload(mouseToolAction())
            });
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
            let key = action.payload.key;
            let value = action.payload.value;
            let featureIndex = action.payload.featureIndex;
            state.currentGeoJSON.features[featureIndex].properties[key]=value;
            // console.log(JSON.stringify(state.currentGeoJSON.features[featureIndex].properties))
            let properties = [];
            let index=0;
            for(let feature of state.currentGeoJSON.features){
                properties.push(state.currentGeoJSON.features[index].properties);
                index += 1;
            }
            state.properties = properties;
        },
        deleteProperty: (state, action) =>{
            let key = action.payload.key;
            let featureIndex = action.payload.featureIndex;
            delete state.currentGeoJSON.features[featureIndex].properties[key];
            // console.log(JSON.stringify(state.currentGeoJSON.features[featureIndex].properties))
            
            let properties = [];
            let index=0;
            for(let feature of state.currentGeoJSON.features){
                properties.push(state.currentGeoJSON.features[index].properties);
                index += 1;
            }
            state.properties = properties;
        },
        addProperty: (state, action) =>{
            let key = action.payload.key;
            let value = action.payload.value;
            let featureIndex = action.payload.featureIndex;

            state.currentGeoJSON.features[featureIndex].properties[key]=value;

            let properties = [];
            let index=0;
            for(let feature of state.currentGeoJSON.features){
                properties.push(state.currentGeoJSON.features[index].properties);
                index += 1;
            }
            state.properties = properties;
        }
        
    }
});

export const { setPrevGeoJSON, setCurrentGeoJSON, setInitialized, setEditTool, setMapRef,
startPolylineDraw, endPolylineDraw, unselectTool, setLayerGroup, setFeatureClicked, setFeatureIndexClicked,
 startMouseTracking, setLayerClickedId, setLayerClickedEditor, addVertex, stopMouseTracking,
setDraggable, unsetDraggable, startPolygonDraw, endPolygonDraw, startMarker, endMarker, 
startSplit, endSplit,
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