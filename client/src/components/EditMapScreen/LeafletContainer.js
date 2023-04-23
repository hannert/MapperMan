import * as L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import hash from 'object-hash';
import 'leaflet-editable';
import { setFeatureClicked, setFeatureIndexClicked, setMapRef } from '../../app/store-actions/leafletEditing';

export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    // For a ref out of a leaflet div

    // L.Map.addInitHook(function () {
    //    mapRef = this; 
    // });
    var maps = []

    useEffect(() => {
        if(mapRef.current !== null){
            // this sets a property called edit tools options to true
            (mapRef.current).editTools = new L.Editable(mapRef.current, {editable: true});
            // this add an 'editable' : true property on leaflet map instance
            mapRef.current.options['editable'] = true;
            dispatch(setMapRef(mapRef.current));

            var polyline = L.polyline([[43.1, 1.2], [43.2, 1.3],[43.3, 1.2]]).addTo(mapRef.current);
            polyline.enableEdit();
            for(let feature of geoJSON.features){
                // Very cursed to add each as coordinates
                L.polygon(feature.geometry.coordinates).addTo(mapRef.current).on({
                    'click': function(e){
                        if(e.target.editEnabled()){
                            //this don't work
                            console.log(e.target);
                            console.log(e.target.disableEdit());
                        }else{
                            console.log("Event TARGET:")
                            // console.log(e.target);
                            // console.log(geoJSON.features.indexOf(feature))

                            dispatch(setFeatureClicked(feature));
                            dispatch(setFeatureIndexClicked(geoJSON.features.indexOf(feature)))

                            console.log(e.target.enableEdit());
                            maps.push(e.target);
                        }
                    }
                });
            }
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
