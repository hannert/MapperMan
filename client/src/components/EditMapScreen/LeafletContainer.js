import * as L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function LeafletContainer(){


    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const [map, setMap] = useState(null);

    // useEffect(() => {    
    //     L.geoJSON(geoJSON).addTo(L.map('map'));
    // }, [geoJSON]);

    useEffect(() => {
        console.log('Leaflet Container Rendered');
        console.log(geoJSON);
        var mapObj = L.map('map').setView([0, 0], 0);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapObj);
    }, []);


    return (
        <div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
            <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
            <div id="map"></div>            
        </div>    
    )
}
