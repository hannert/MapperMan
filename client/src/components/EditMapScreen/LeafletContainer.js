import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import hash from 'object-hash';
import React, { useEffect, useRef, useContext } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setFeatureIndex, setMapRef, setProperties, shapes } from '../../app/store-actions/leafletEditing';
import DeleteVertex_Transaction from '../../app/jsTPS/Transactions/DeleteVertex_Transaction';
import { addCreatePolygonTransaction, addCreatePolylineTransaction, addDeleteFeatureTransaction, addDeleteVertexTransaction, addMoveFeatureTransaction, addMoveVertexTransaction, initTps, setVertexIndex, setfStartPos, setvStartPos } from '../../app/store-actions/transactions';
import { SocketContext } from '../../socket';



export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const tps = useSelector((state) => state.transactions.tps);
    const socket = useContext(SocketContext);

    const mapRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if(mapRef.current !== null){
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
                    console.log(e.vertex.getIndex());
                    dispatch(setVertexIndex(e.vertex.getIndex()));
                });

                e.layer.on('editable:vertex:deleted', (e) => {
                    if(e.layer.shape === shapes.polygon){
                        console.log(e);

                        /** HOW TO MAKE CHANGES SYNC:
                         * 
                         * 1. Edit the dispatch to also take the socket and mapID
                         * 2. In the redux store, emit the change
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
                    }
                    if(e.layer.shape === shapes.polyline){
                        console.log(e);
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
                    dispatch(addMoveVertexTransaction({
                        layerGroup: layerGroup,
                        featureIndex: e.target.featureIndex,
                        endPos: latlng
                    }))
                    
                });

                e.layer.on('dragstart', (e) => {
                    console.log(e);
                    console.log(e.target._latlngs[0][0])
                    dispatch(setfStartPos(e.target._latlngs[0][0]));
                });
                
                e.layer.on('dragend', (e) => {
                    console.log(e);
                    console.log(e.target._latlngs[0][0])

                    // TODO need to account for it going in different directions, like quadrant 1, 2, 3 or 4 of a graph
                    
                    dispatch(addMoveFeatureTransaction({
                        layerGroup: layerGroup,
                        featureIndex: e.target.featureIndex,
                        endPos: e.target._latlngs[0][0]
                    }))
                });

                e.layer.on('remove', (e) => {
                    //If it was created through jstps ignore it
                    console.log(e.target);

                    if(Object.hasOwn(e.target, 'inStack')){
                        return
                    }

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
                        featureIndex: e.sourceTarget.featureIndex
                    }))
                    
                });
            });

            mapRef.current.on('editable:disable', (e) => {
                e.layer.off();
            });

            mapRef.current.on('editable:drawing:end', (e) => {
                console.log('Editable created');
                console.log(e);
                if(e.layer.shape === shapes.polygon){
                    dispatch(addCreatePolygonTransaction({
                        layerGroup: layerGroup,
                        latlngs: e.layer._latlngs[0],
                        properties: e.layer.properties,
                        featureIndex: e.layer.featureIndex
                    }))
                }

                if(e.layer.shape === shapes.polyline){
                    console.log(e.layer);
                    dispatch(addCreatePolylineTransaction({
                        layerGroup: layerGroup,
                        latlngs: e.layer._latlngs,
                        properties: e.layer.properties,
                        featureIndex: e.layer.featureIndex
                    }))
                }

            });
            

            console.log(geoJSON);
            let properties = [];

            let idx = 0;
            for(let feature of geoJSON.features){
                // Have to add draggable here first then disable/enable it when wanted
                const polygon = L.polygon(L.GeoJSON.geometryToLayer(feature)._latlngs, {draggable:true});
                polygon.dragging.disable();
                // polygon._latlngs[0].push(L.latLng(0, 0));
                polygon.featureIndex = idx;
                polygon.properties = geoJSON.features[idx].properties
                polygon.shape = shapes.polygon;
                // console.log(polygon);
                dispatch(initTps());
                
                // TODO prob a better way to do this
                // console.log(idx);
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



            socket.on('received transaction', (transaction)=>{
                //Add transaction to the stack
                if(transaction.type === "delete vertex"){

                    console.log("received a delete vertex transaction");
                    let transactionLatLng = L.latLng(transaction.lat,transaction.lng);
                    for(let layer of layerGroup.getLayers()){
                        if(layer.featureIndex === transaction.featureIndex){
                            //can't search through latlngs like this on everything :(
                            if(transaction.shape === shapes.polygon){
                                for(let latlng of layer._latlngs[0]){
                                    if(latlng.equals(transactionLatLng)){
                                        console.log('found it');
                                        let idx = layer._latlngs[0].indexOf(latlng);
                                        console.log(idx);
                                        layer._latlngs[0].splice(idx, 1);
                                        
                                        console.log('deleted vertex')
                                        //absolutely brutal on client side performance
                                        layer.redraw();
                                        layer.disableEdit();
                                        layer.enableEdit();
                                    }
                                }
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
                                        layer.disableEdit();
                                        layer.enableEdit();
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
                                console.log('found it');
                                console.log('Inserting latlng');
                                console.log(transactionLatLng);
                                console.log(transaction.vertexIndex)
                                layer._latlngs[0].splice(transaction.vertexIndex, 0, transactionLatLng);
                
                                console.log('added vertex')
                                //absolutely brutal on client side performance
                                layer.redraw();
                                layer.disableEdit();
                                layer.enableEdit();
                            }
                            if(transaction.shape === shapes.polyline){
                                console.log('found it');
                                layer._latlngs.splice(transaction.vertexIndex, 0, transactionLatLng);
                                
                                console.log('added vertex')
                                //absolutely brutal on client side performance
                                layer.redraw();
                                layer.disableEdit();
                                layer.enableEdit();
                            }
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
