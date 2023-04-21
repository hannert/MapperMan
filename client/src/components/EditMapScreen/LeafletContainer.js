import * as L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useSelector } from 'react-redux';
import hash from 'object-hash';
import 'leaflet-editable';

export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const mapRef = useRef(null);
    // For a ref out of a leaflet div

    // L.Map.addInitHook(function () {
    //    mapRef = this; 
    // });
    var maps = []

    useEffect(() => {
        if(mapRef.current !== null){
            console.log('Trying to attach editing tools')
            console.log(mapRef.current);
            // this sets a property called edit tools options to true
            (mapRef.current).editTools = new L.Editable(mapRef.current, {editable: true});
            // this add an 'editable' : true property on leaflet map instance
            mapRef.current.options['editable'] = true;
            var polyline = L.polyline([[43.1, 1.2], [43.2, 1.3],[43.3, 1.2]]).addTo(mapRef.current);
            // var stuff = L.geoJson(geoJSON).addTo(mapRef.current);
            // console.log(stuff);
            for(let feature of geoJSON.features){
                console.log(feature)
                // Very cursed to add each as coordinates

                L.polygon(feature.geometry.coordinates).addTo(mapRef.current).on({
                    'click': function(e){
                        console.log('Clicked on polygon')
                        //Probably a better way to do this than using an array
                        console.log(this);
                        console.log(e.target);
                        if(e.target.editEnabled()){
                            //this don't work
                            console.log(e.target);
                            console.log(e.target.disableEdit());
                        }else{
                            console.log(e.target);
                            console.log(e.target.enableEdit());
                            maps.push(e.target);
                        }
                    }
                });
            }
            // console.log(stuff._layers);
            console.log(polyline);
            polyline.enableEdit();
            console.log(geoJSON);
        }
    }, [mapRef.current]);

    // Leaflet Map Container will only be used for initial map creation and that's it
    return (
        <MapContainer center={[0,0]} zoom={0} doubleClickZoom={false} ref={mapRef}
        id="mapId" style={{width:'100%', height:'100%'}}>
            <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
            <GeoJSON 
                key={hash(geoJSON)} 
                />
        </MapContainer>
    )
}
