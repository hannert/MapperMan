import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import hash from 'object-hash';
import React, { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setFeatureIndex, setMapRef, setProperties } from '../../app/store-actions/leafletEditing';
import DeleteVertex_Transaction from '../../app/jsTPS/Transactions/DeleteVertex_Transaction';
import { addDeleteFeatureTransaction, addDeleteVertexTransaction, addMoveFeatureTransaction, addMoveVertexTransaction, initTps, setVertexIndex, setfStartPos, setvStartPos } from '../../app/store-actions/transactions';

export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
    
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
                    console.log(e);
                    dispatch(addDeleteVertexTransaction({
                        layerGroup: layerGroup, 
                        latlng: e.latlng, 
                        featureIndex: e.sourceTarget.featureIndex
                    }))
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
                // console.log(polygon);
                dispatch(initTps());
                // polygon.on('editable:vertex:click', (e) => {
                //     console.log(e.vertex.getIndex());
                //     dispatch(setVertexIndex(e.vertex.getIndex()));
                // });


                // polygon.on('editable:vertex:deleted', (e) => {
                //     console.log(e);
                //     dispatch(addDeleteVertexTransaction({
                //         layerGroup: layerGroup, 
                //         latlng: e.latlng, 
                //         featureIndex: e.sourceTarget.featureIndex
                //     }))
                // });

                // polygon.on('editable:vertex:dragstart', (e) => {
                //     //cursed format
                //     let latlng = L.latLng(e.vertex.latlng['lat'], e.vertex.latlng['lng']);
                //     dispatch(setvStartPos(latlng));

                // });

                // polygon.on('editable:vertex:dragend', (e) => {
                //     let latlng = L.latLng(e.vertex.latlng['lat'], e.vertex.latlng['lng']);
                //     dispatch(addMoveVertexTransaction({
                //         layerGroup: layerGroup,
                //         featureIndex: e.target.featureIndex,
                //         endPos: latlng
                //     }))
                // });

                // polygon.on('dragstart', (e) => {
                //     console.log(e);
                //     console.log(e.target._latlngs[0][0])
                //     dispatch(setfStartPos(e.target._latlngs[0][0]));
                // });
                
                // polygon.on('dragend', (e) => {
                //     console.log(e);
                //     console.log(e.target._latlngs[0][0])

                //     // TODO need to account for it going in different directions, like quadrant 1, 2, 3 or 4 of a graph
                    
                //     dispatch(addMoveFeatureTransaction({
                //         layerGroup: layerGroup,
                //         featureIndex: e.target.featureIndex,
                //         endPos: e.target._latlngs[0][0]
                //     }))
                // });

                // polygon.on('remove', (e) => {
                //     console.log('remove event')
                //     let arr = []
                //     for(let latlng of e.sourceTarget.getLatLngs()[0]){
                        
                //         let copy = L.latLng(
                //             JSON.parse(JSON.stringify(latlng['lat'])), 
                //             JSON.parse(JSON.stringify(latlng['lng'])))

                //         arr.push(copy);
                //     }
                //     console.log(arr);

                //     // TODO For some reason this causes an error

                //     dispatch(addDeleteFeatureTransaction({
                //         layerGroup: layerGroup,
                //         latlngs: arr,
                //         properties: e.sourceTarget.properties,
                //         featureIndex: e.sourceTarget.featureIndex,
                //         mapRef: mapRef.current
                //     }))
                    
                // });
                
                // TODO prob a better way to do this
                properties.push(geoJSON.features[idx].properties);
                idx += 1;
                layerGroup.addLayer(polygon);
            }

            // TODO prob a better way to do this
            dispatch(setProperties(properties));
            dispatch(setFeatureIndex(idx));
            layerGroup.addTo(mapRef.current)
            
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
