import * as L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import hash from 'object-hash';
import 'leaflet-editable';
import { clearMap, editTools, setLayerGroup, setMapRef,setFeatureClicked, setFeatureIndexClicked } from '../../app/store-actions/leafletEditing';


export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const editTool = useSelector((state) => state.leafletEditing.editTool);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
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

            console.log(polyline.enableEdit());
            
            mapRef.current.on('editable:vertex:dragstart', function(e){
                console.log(e);
            });

            mapRef.current.on('editable:vertex:dragend', function(e){
                console.log(e);
                console.log(e.sourceTarget._startPos);
                console.log(e.sourceTarget._newPos);
            });


            if(layerGroup !== null){
                console.log('clear map')
                layerGroup.clearLayers()
            }


            const lGroup = L.layerGroup();

            for(let feature of geoJSON.features){
                // Very cursed to add each as coordinates
                const polygon = L.polygon(L.GeoJSON.geometryToLayer(feature)._latlngs).on({
                    'click': (e)=>{
                        // console.log('Edit tool')
                        // console.log(editTool);
                        // console.log(editTools.mouse);
                        if(editTool === editTools.mouse){
                            
                            if(e.target.editEnabled()){
                                console.log(e.target);
                                console.log(e.target.disableEdit());
                            }else{
                                console.log(e.target);
                                console.log(e.target.enableEdit());
                                maps.push(e.target);
                            }
                        }
                    }
                });
                lGroup.addLayer(polygon);
                // console.log(polygon);
            }
            console.log('lGroup')
            console.log(lGroup);
            lGroup.addTo(mapRef.current)
            dispatch(setLayerGroup(lGroup));
            
        }
    }, [mapRef.current, editTool]);

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
