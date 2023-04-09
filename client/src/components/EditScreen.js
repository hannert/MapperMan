import { GeoJSON, MapContainer, TileLayer, Pane } from "react-leaflet";
import React, { createRef, useState, useEffect } from 'react'
import file from './NA.json';
import hash from 'object-hash';
import { Box } from "@mui/system";
import { Button } from "@mui/material";

export default function EditScreen(){

    return (
        <Box sx ={{width:'100%', height:'100%'}}>
            <MapContainer center={[51.505, -0.09]} zoom={1} doubleClickZoom={false}
                  id="mapId" style={{width:'100%', height:'100%'}}>
                    <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                    <GeoJSON 
                        key={hash(file)} 
                        data={file} 
                        />
            </MapContainer>
        </Box>

    )
}