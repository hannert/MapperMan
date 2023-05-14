import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import hash from 'object-hash';
import React, { useContext, useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { mouseToolAction, setEditTool, setFeatureIndex, setFeatureIndexClicked, setLayerClickedId, setMapRef, setProperties, shapes } from '../../app/store-actions/leafletEditing';
import DeleteVertex_Transaction from '../../app/jsTPS/Transactions/DeleteVertex_Transaction';
import { addCreatePolygonTransaction, addCreatePolylineTransaction, addDeleteFeatureTransaction, addDeleteVertexTransaction, addMoveFeatureTransaction, addMoveVertexTransaction, initTps, setDeleteParams, setVertexIndex, setfStartPos, setvStartPos } from '../../app/store-actions/transactions';
import { SocketContext } from '../../socket';



export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const tps = useSelector((state) => state.transactions.tps);
    const socket = useContext(SocketContext);
    const user = useSelector((state) => state.accountAuth.user);

    const mapRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if(mapRef.current !== null){

            dispatch(setEditTool(null));
            console.log('Leaflet render')
            // this sets a property called edit tools options to true
            console.log(mapRef);
            (mapRef.current).editTools = new L.Editable(mapRef.current, {editable: true});
            // this adds an 'editable' : true property on leaflet map instance
            mapRef.current.options['editable'] = true;
            dispatch(setMapRef(mapRef.current));

            console.log("Layergroup: ",layerGroup);
            layerGroup.clearLayers()
            console.log('Layergroup after clear: ', layerGroup);
            

            mapRef.current.on('editable:enable', (e) => {
                console.log('Enable edit');
                console.log(e);

                e.layer.on('editable:vertex:click', (e) => {
                    // We need to find the index of the subpolygon, if it is nested 
                    // before it is removed from the polygon 
                    e.cancel();
                    let indexOfVertex = e.vertex.getIndex();
                    let vertex = e.vertex.latlng
                    let tempSubPolyIndex = 0;

                    for(let [i, polygon] of e.layer._latlngs.entries()){
                        if(Array.isArray(polygon[0])){
                            // One level down is where we will find the latlngs
                            if(polygon[0][indexOfVertex]?.lat === vertex.lat && polygon[0][indexOfVertex]?.lng === vertex.lng){
                                console.log('polygon ', i, ' contains the vertex!')
                                tempSubPolyIndex = i;
                                dispatch(setDeleteParams({'subPolyIndex': tempSubPolyIndex, 'vertexIndex': indexOfVertex}))
                            }
                        } else {
                            if(polygon[indexOfVertex]?.lat === vertex.lat && polygon[indexOfVertex]?.lng === vertex.lng){
                                console.log('polygon ', i, ' contains the vertex!')
                                tempSubPolyIndex = i;
                                dispatch(setDeleteParams({'subPolyIndex': tempSubPolyIndex, 'vertexIndex': indexOfVertex}))
                            }
                        }
                    }



                    e.vertex.delete();
                });

                // e.layer.on('editable:vertex:click', (e) => {
                //     // We need to find the index of the subpolygon, if it is nested
                //     console.log('Editable vertex clicked with index of:', e.vertex.getIndex());
                //     console.log(e)
                //     console.log(e.vertex)
                //     dispatch(setVertexIndex(e.vertex.getIndex()));
                //     e.vertex.delete();
                // });

                e.layer.on('editable:vertex:deleted', (e) => {

                  
                    if(e.layer instanceof L.Polygon){
                        console.log(e);
                        /** HOW TO MAKE CHANGES SYNC:
                         * 
                         * 1. Edit the dispatch to also take the socket and mapID
                         * 2. In the transaction redux slice, emit the change
                         * 3. Add it to our transaction stack using the transaction constructor, be 
                         * sure to pass the socket and mapID as well since it will be needed when undoing/redoing 
                         * 3. Create the respective listeners in the backend, and their responses
                         * 4. Add emits of the changes to the transaction object, be sure to handle undo/redo accordingly
                         * 5. Handle the responses from the backend in the area labeled below, you 
                         * can basically copy paste the logic used in the transactions to reflect
                         * the changes in the clientside, be sure to change all references to 
                         * "this.variable"
                         * 
                         */
                        dispatch(addDeleteVertexTransaction({
                            layerGroup: layerGroup, 
                            latlng: e.latlng, 
                            featureIndex: e.sourceTarget.featureIndex,
                            shape: shapes.polygon,
                            mapId: mapId,
                            socket: socket
                        }))
                    }else if(e.layer instanceof L.Polyline){
                        dispatch(addDeleteVertexTransaction({
                            layerGroup: layerGroup, 
                            latlng: e.latlng, 
                            featureIndex: e.sourceTarget.featureIndex,
                            
                            shape: shapes.polyline,
                            mapId: mapId,
                            socket: socket
                        }))
                    }
                });

                e.layer.on('editable:vertex:dragstart', (e) => {
                    //cursed format
                    let latlng = L.latLng(e.vertex.latlng['lat'], e.vertex.latlng['lng']);
                    dispatch(setvStartPos(latlng));

                });

                e.layer.on('editable:vertex:dragend', (e) => {
                    let latlng = L.latLng(e.vertex.latlng['lat'], e.vertex.latlng['lng']);
                    console.log('dragend vertex index', e.vertex.getIndex())
                    let indexOfVertex = e.vertex.getIndex();
                    let vertex = e.vertex.latlng
                    let subPolyIndex = 0;
                    // Get subpoly
                    // console.log("e.layer in dragend", e.layer)
                    // console.log(vertex)
                    // console.log(indexOfVertex)
                    for(let [i, polygon] of e.layer._latlngs.entries()){
                        console.log(polygon)
                        console.log(polygon[indexOfVertex])
                        if(Array.isArray(polygon[0])){
                            // One level down is where we will find the latlngs
                            if(polygon[0][indexOfVertex]?.lat === vertex.lat && polygon[0][indexOfVertex]?.lng === vertex.lng){
                                console.log('polygon ', i, ' contains the vertex!')
                                subPolyIndex = i;
                            }
                        } else {
                            if(polygon[indexOfVertex]?.lat === vertex.lat && polygon[indexOfVertex]?.lng === vertex.lng){
                                console.log('polygon ', i, ' contains the vertex!')
                                subPolyIndex = i;
                            }
                        }
                        
                    }
                    dispatch(addMoveVertexTransaction({
                        layerGroup: layerGroup,
                        featureIndex: e.target.featureIndex,
                        subPolyIndex: subPolyIndex,
                        endPos: latlng,
                        mapId: mapId,
                        socket: socket
                    }))
                    
                    // let geoJSON = layerGroup.toGeoJSON();
                    // dispatch(saveGeojsonThunk(
                    //     {owner: user, 
                    //     mapData: geoJSON, 
                    //     id: mapId}
                    // ))


                    
                    
                });

                e.layer.on('dragstart', (e) => {
                    console.log(e);
                    console.log(e.target._latlngs[0][0])
                    dispatch(setfStartPos(e.target._latlngs[0][0]));
                });
                
                e.layer.on('dragend', (e) => {
                    console.log(e);
                    console.log(e.target._latlngs[0][0])
                    
                    dispatch(addMoveFeatureTransaction({
                        layerGroup: layerGroup,
                        featureIndex: e.target.featureIndex,
                        endPos: e.target._latlngs[0][0],
                        mapId: mapId,
                        socket: socket
                    }))
                });

                e.layer.on('remove', (e) => {
                    //If it was created through jstps ignore it
                    console.log(e.target);
                    
                    // if(e.target?.ignore === true){
                    //     e.target.ignore = false;
                    //     return
                    // }

                    console.log('remove event')
                    let arr = []
                    for(let latlng of e.sourceTarget.getLatLngs()[0]){
                        
                        let copy = L.latLng(
                            JSON.parse(JSON.stringify(latlng['lat'])), 
                            JSON.parse(JSON.stringify(latlng['lng'])))
                        arr.push(copy);
                    }
                    console.log(arr);

                    // TODO For some reason this causes an error

                    dispatch(addDeleteFeatureTransaction({
                        layerGroup: layerGroup,
                        latlngs: arr,
                        properties: e.sourceTarget.properties,
                        featureIndex: e.sourceTarget.featureIndex,
                        socket: socket,
                        mapId: mapId
                    }))
                    
                });
            });

            // TODO disabling for testing purposes, merge won't work now
            mapRef.current.on('editable:disable', (e) => {
                // console.log('disable edit')
                // // console.log(e);
                // console.log(e);
                
                e.layer.off()
                e.layer.on('click', (e) => {
                    console.log(e);
                    dispatch(setFeatureIndexClicked(e.sourceTarget.featureIndex));
                    dispatch(mouseToolAction())
                });
            });

            mapRef.current.on('editable:drawing:end', (e) => {
                
                console.log('Editable created');
                console.log(e);
                /**
                 * TODO currently this fires a lot since every time a polyline or polygon is clicked
                 * it will immediately get added to the layergroup, need to find a way to only add it
                 * purposefully
                 * 
                 * Shapes have inheritance, need to have else ifs
                 */
                console.log(e.sourceTarget instanceof L.Polygon);
                console.log(e.layer instanceof L.Polygon);
                console.log(e.layer instanceof L.Polyline);
                
                if(e.layer instanceof L.Polygon){
                    dispatch(addCreatePolygonTransaction({
                        layerGroup: layerGroup,
                        latlngs: e.layer._latlngs[0],
                        properties: e.layer.properties,
                        featureIndex: e.layer.featureIndex,
                        socket: socket,
                        mapId: mapId
                    }))
                }else if(e.layer instanceof L.Polyline){
                    console.log(e.layer);
                    dispatch(addCreatePolylineTransaction({
                        layerGroup: layerGroup,
                        latlngs: e.layer._latlngs,
                        properties: e.layer.properties,
                        featureIndex: e.layer.featureIndex,
                        socket: socket,
                        mapId: mapId
                    }))
                }

            });
            

            console.log(geoJSON);
            let properties = [];

            let idx = 0;
            for(let feature of geoJSON.features){
                console.log(feature);
                // Have to add draggable here first then disable/enable it when wanted
                // console.log(L.GeoJSON.geometryToLayer(feature));
                
                const polygon = L.polygon(L.GeoJSON.geometryToLayer(feature)._latlngs, {draggable:true});

                console.log(polygon);
                console.log(feature.geometry.coordinates);
                // console.log(L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates))
                console.log(L.GeoJSON.geometryToLayer(feature)._latlngs);
                polygon.dragging.disable();
                // polygon._latlngs[0].push(L.latLng(0, 0));
                polygon.featureIndex = idx;
                polygon.properties = geoJSON.features[idx].properties
                // console.log(polygon);
                dispatch(initTps());
                
                polygon.on('click', (e) => {
                    dispatch(setFeatureIndexClicked(e.sourceTarget.featureIndex));
                    dispatch(mouseToolAction())
                });

                // TODO prob a better way to do this
                properties.push(geoJSON.features[idx].properties);
                idx += 1;
                layerGroup.addLayer(polygon);
            }

            // TODO prob a better way to do this
            dispatch(setProperties(properties));
            dispatch(setFeatureIndex(idx));
            layerGroup.addTo(mapRef.current);



            /**Socket stuff, might have to move to its own useEffect */
            /**HANDLE RECEIVING TRANSACTIONS HERE */



            socket.on('received delete vertex transaction', (transaction)=>{
                console.log("delete transaction", transaction)
                //Add transaction to the stack
                if(transaction.type === "delete vertex"){

                    console.log("received a delete vertex transaction");
                    let transactionLatLng = L.latLng(transaction.lat,transaction.lng);
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            console.log("Found Layer")
                            if(transaction.shape === shapes.polygon){
                                console.log("Is polygon!")
                                let groupedPolygon = Array.isArray(layer._latlngs[0])
                                if(layer._latlngs.length > 1 && groupedPolygon === true){
                                    console.log("Grouped polygon delete socket", layer._latlngs[transaction.subPolyIndex])
                                    layer._latlngs[transaction.subPolyIndex][0].splice(transaction.vertexIndex, 1);
                                } else {
                                    console.log("Singular polygon splice", layer._latlngs, transaction.subPolyIndex)
                                    layer._latlngs[transaction.subPolyIndex].splice(transaction.vertexIndex, 1);
                                }
                                console.log('deleted vertex from polygon from socket')
                                
                                layer.redraw();

                            }
                            if(transaction.shape === shapes.polyline){
                                for(let latlng of layer.getLatLngs()){
                                    if(latlng.equals(transactionLatLng, .1)){
                                        console.log('found it');
                                        let idx = layer.getLatLngs().indexOf(latlng);
                                        console.log(idx);
                                        layer.getLatLngs().splice(idx, 1);
                                        
                                        console.log('deleted vertex')
                                        //absolutely brutal on client side performance
                                        layer.redraw();
                                        // layer.disableEdit();
                                    }
                                }
                            }
                        }
                    }
                }

                else if(transaction.type === "undo delete vertex"){
                    
                    console.log("received an undo from the other client")

                    let transactionLatLng = L.latLng(transaction.lat,transaction.lng);
                    for(let layer of layerGroup.getLayers()){
            
                        if(layer.featureIndex === transaction.featureIndex){
                            if(transaction.shape === shapes.polygon){
                                console.log("Is polygon!")
                                let groupedPolygon = Array.isArray(layer._latlngs[0])
                                if(layer._latlngs.length > 1 && groupedPolygon === true){
                                    layer._latlngs[transaction.subPolyIndex][0].splice(transaction.vertexIndex, 0, transactionLatLng);
                                } else {
                                    layer._latlngs[transaction.subPolyIndex].splice(transaction.vertexIndex, 0, transactionLatLng);
                                }
                                console.log('Undid vertex from polygon from socket')
                                
                                layer.redraw();

                            }
                            if(transaction.shape === shapes.polyline){
                                console.log('found it');
                                layer._latlngs.splice(transaction.vertexIndex, 0, transactionLatLng);
                                
                                console.log('added vertex')
                                //absolutely brutal on client side performance
                                layer.redraw();
                                // layer.disableEdit();
                            }
                        }
                    }
                }
            })

            socket.on('received move vertex transaction', (transaction)=>{
                if(transaction.type==="move vertex"){
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){

                            let startPos = L.latLng(transaction.startLat, transaction.startLng);
                            let endPos = L.latLng(transaction.endLat, transaction.endLng);

                            for(let [i, estrangedPolygon] of layer._latlngs.entries()){
                                let groupedPolygon = Array.isArray(estrangedPolygon[0])
                                if(groupedPolygon === true){
                                    for(let [j, lattie] of estrangedPolygon.entries()){
                                        for(let [index, latlng] of lattie.entries()){
                                            console.log("HI!!!")
                                            if(latlng.equals(startPos, .000001)){
                                                console.log('moved')
                                                layer._latlngs[i][j].splice(index, 1);
                                                layer._latlngs[i][j].splice(index, 0, endPos);
            
                                                //absolutely brutal on client side performance
                                                layer.redraw();
                                                layer.disableEdit();
                                                break;
                                            }
                                        }
                                    }
                                }
                                if(groupedPolygon === false){
                                    for(let latlng of estrangedPolygon){
                                        if(latlng.equals(startPos, .000001)){
                                            console.log('moved')
                                            let idx = layer._latlngs[i].indexOf(latlng);
                                            layer._latlngs[i].splice(idx, 1);
                                            layer._latlngs[i].splice(idx, 0, endPos);
            
                                            //absolutely brutal on client side performance
                                            layer.redraw();
                                            layer.disableEdit();
                                            break;
                                        }
                                    }
                                }

                            }
                        }
                    }
                }

                else if(transaction.type==="undo move vertex"){
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){

                            let startPos = L.latLng(transaction.startLat, transaction.startLng);
                            let endPos = L.latLng(transaction.endLat, transaction.endLng);

                            for(let [i, estrangedPolygon] of layer._latlngs.entries()){
                                let groupedPolygon = Array.isArray(estrangedPolygon[0])
                                if(groupedPolygon === true){
                                    for(let [j, lattie] of estrangedPolygon.entries()){
                                        for(let [index, latlng] of lattie.entries()){
                                            console.log("HI!!!")
                                            if(latlng.equals(endPos, .000001)){ // Start from endPos
                                                console.log('moved')
                                                layer._latlngs[i][j].splice(index, 1);
                                                layer._latlngs[i][j].splice(index, 0, startPos); // To StartPos
            
                                                //absolutely brutal on client side performance
                                                layer.redraw();
                                                layer.disableEdit();
                                                break;
                                            }
                                        }
                                    }
                                }
                                if(groupedPolygon === false){
                                    for(let latlng of estrangedPolygon){
                                        if(latlng.equals(endPos, .000001)){ // Start from endPos
                                            console.log('moved')
                                            let idx = layer._latlngs[i].indexOf(latlng);
                                            layer._latlngs[i].splice(idx, 1);
                                            layer._latlngs[i].splice(idx, 0, startPos); // To StartPos
            
                                            //absolutely brutal on client side performance
                                            layer.redraw();
                                            layer.disableEdit();
                                            break;
                                        }
                                    }
                                }

                            }

                        }
                    }
                }
            })

            socket.on('received move feature transaction', (transaction)=>{
                if(transaction.type ==='move feature'){
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            console.log('found it');
                            //can't search through latlngs like this on everything :(
                            for(let latlng of layer._latlngs[0]){
                                latlng['lat'] += transaction.offsetX;
                                latlng['lng'] += transaction.offsetY;
                                console.log(latlng['lat'] + ' ' + latlng['lng']);
                            }
                            layer.redraw();
                            layer.disableEdit();
                        }
                    }
                }
                else if(transaction.type === 'undo move feature'){
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            console.log('found it');
                            //can't search through latlngs like this on everything :(
                            for(let latlng of layer._latlngs[0]){
                                latlng['lat'] -= transaction.offsetX;
                                latlng['lng'] -= transaction.offsetY;
                                console.log(latlng['lat'] + ' ' + latlng['lng']);
                            }
                            layer.redraw();
                            layer.disableEdit();
                        }
                    }
                }
            })

            socket.on('received delete feature transaction', (transaction)=>{
                if(transaction.type ==='delete feature'){
                    console.log("*****************")
                    console.log(layerGroup)
                    console.log("received delete feature for", transaction.featureIndex)
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            //can't search through latlngs like this on everything :(
                            layerGroup.removeLayer(layer);
                        }
                    }
                }
                else if(transaction.type === 'undo delete feature'){
                    // let transactionLatLng = L.latLng(transaction.lat,transaction.lng);

                    const polygon = L.polygon(transaction.latlngs, {draggable:true});
                    polygon.dragging.disable();
                    console.log(polygon);
                    polygon.featureIndex = transaction.featureIndex;
                    polygon.properties = transaction.properties;
                    //Don't add an extra transaction
                    polygon.inStack = true;

                    layerGroup.addLayer(polygon);
                }
            })

            socket.on('received add polygon transaction', (transaction)=>{
                if(transaction.type ==='add polygon'){

                    /**Convert the latlng pairs array from transaction to an array of latlngs */
                    let arr = [];
                    for(let i=0; i<transaction.latlngs.length; i++){
                        let latlng = L.latLng(transaction.latlngs[i].lat,transaction.latlngs[i].lng)
                        arr.push(latlng)
                    }



                    const polygon = L.polygon(arr, {draggable:true});
                    polygon.dragging.disable();
                    console.log(polygon);
                    polygon.featureIndex = transaction.featureIndex;
                    polygon.properties = transaction.properties;
                    //Don't add an extra transaction
                    polygon.inStack = true;
                    layerGroup.addLayer(polygon);
                    console.log(layerGroup)
                }
                else if(transaction.type === 'undo add polygon'){
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            //can't search through latlngs like this on everything :(
                            layerGroup.removeLayer(layer);
                        }
                    }
                }
            })

            socket.on('received add polyline transaction', (transaction)=>{
                if(transaction.type ==='add polyline'){

                    /**Convert the latlng pairs array from transaction to an array of latlngs */
                    let arr = [];
                    for(let i=0; i<transaction.latlngs.length; i++){
                        let latlng = L.latLng(transaction.latlngs[i].lat,transaction.latlngs[i].lng)
                        arr.push(latlng)
                    }

                    console.log('Making polyline');
                    console.log(arr);
                    const polyline = L.polyline(arr, {draggable:true});
                    polyline.dragging.disable();
                    console.log(polyline);
                    polyline.featureIndex = transaction.featureIndex;
                    polyline.properties = transaction.properties;
                    //Don't add an extra transaction
                    polyline.inStack = true;
                    layerGroup.addLayer(polyline);
                }
                else if(transaction.type === 'undo add polyline'){
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            layerGroup.removeLayer(layer);
                        }
                    }
                }
            })

            
        }
    }, [mapRef.current]);



    // Leaflet Map Container will only be used for initial map creation and that's it
    return (
        <MapContainer center={[0,0]} zoom={2} doubleClickZoom={false} ref={mapRef}
        id="mapId" style={{width:'100%', height:'100%'}}>
            <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
            <GeoJSON 
                key={hash(geoJSON)} 
                />
        </MapContainer>   
    )
}
