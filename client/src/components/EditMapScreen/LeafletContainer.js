import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import hash from 'object-hash';
import React, { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setMapRef } from '../../app/store-actions/leafletEditing';

export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const editTool = useSelector((state) => state.leafletEditing.editTool);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
    const mergeArray = useSelector((state) => state.leafletEditing.mergeArray);
    const mergedFeature = useSelector((state) => state.leafletEditing.mergedFeature);


    const mapRef = useRef(null);
    const dispatch = useDispatch();
    // For a ref out of a leaflet div

    // L.Map.addInitHook(function () {
    //    mapRef = this; 
    // });
    
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

            for(let feature of geoJSON.features){
                // Have to add draggable here first then disable/enable it when wanted
                const polygon = L.polygon(L.GeoJSON.geometryToLayer(feature)._latlngs, {draggable:true});
                polygon.dragging.disable();
                layerGroup.addLayer(polygon);
            }
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
