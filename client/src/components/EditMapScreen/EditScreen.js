import { AddCircle, AddLocation, Circle, Merge, Mouse, Redo, RemoveCircle, Timeline, Undo, WrongLocation } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Box } from "@mui/system";
import hash from 'object-hash';
import React, { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { getMapByIdThunk } from '../../app/store-actions/editMapList';
import 'leaflet-editable';

import * as L from 'leaflet';

import { setCurrentGeoJSON, setInitialized } from '../../app/store-actions/leafletEditing';
import LeafletContainer from './LeafletContainer';

export default function EditScreen(){

    const [propertyOpen, setPropertyOpen] = useState(false)
    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const dispatch = useDispatch();
    const mapFile = useSelector((state) => state.leafletEditing.currentGeoJSON);
    
    const init = useSelector((state) => state.leafletEditing.initialized);
    const [map, setMap] = useState({});
    const mapRef = useRef(null);

    // For a ref out of a leaflet div

    // L.Map.addInitHook(function () {
    //    mapRef = this; 
    // });

    L.Map.addInitHook(function () {
        L.Map.mergeOptions({
            options:{
                editable: true
            }
        })
    });

    useEffect(() => {
        if(mapRef.current !== null){
            console.log('Trying to attach editing tools')
            console.log(mapRef.current);
            // this sets a property called edit tools options to true
            (mapRef.current).editTools = new L.Editable(mapRef.current, {editable: true});
            // this add an 'editable' : true property on leaflet map instance
            mapRef.current.options['editable'] = true;
        }
    }, [mapRef.current]);

    useEffect(() => {
        if (mapId) {
            console.log('Edit Screen Render');
            dispatch(getMapByIdThunk({id: mapId})).unwrap().then(async(response) => {
                dispatch(setCurrentGeoJSON(response.map.mapData))
                console.log(response.map.mapData);
                // Setting up leaflet div

                // var m = L.map('map').setView([0, 0], 0);
                // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                // }).addTo(m);
                // console.log(m);
                // L.geoJSON(response.map.mapData).addTo(m);
                // var m = L.map('mapId');
                // console.log(m);
                if(mapRef !== null){
                    var polyline = L.polyline([[43.1, 1.2], [43.2, 1.3],[43.3, 1.2]]).addTo(mapRef.current);
                    polyline.enableEdit();
                }

                console.log(mapRef.current);
                dispatch(setInitialized());
            }).catch((error) => {
                console.log(error);
            });
        }   
    }, [mapId])




    

    let leafletSize = ''

    if (propertyOpen === true) {
        leafletSize = {width:'65%', height: '100%'}
    }
    if (propertyOpen === false) {
        leafletSize = {width:'95%', height: '100%', margin:'auto'}
    }


    function handleToggleProperty () {
        setPropertyOpen(!propertyOpen);
    }

    function createData(name, type, value) {
        return { name, type, value};
    }
    const rows = [
        createData('Capital', 'String', 'Bajookieland'),
        createData('Prime Minister', 'String', 'Christopher'),
        createData('isUnlocked', 'Boolean', 'true')
    ]



    let propertyComponent = <Box id='property-editor'></Box>;
    if (propertyOpen === true) {
        propertyComponent = (
            <Box id='property-editor' sx={{width:'35%', height:'100%', backgroundColor:'#1D2026', display:'flex',  flexDirection:'column', alignItems:'flex-start'}}>
                <IconButton onClick={handleToggleProperty} >
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant='h4' sx={{fontFamily:'Koulen', color:"#B9D3E9", marginLeft:'20px'}}>
                    Edit Region Properties
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                        Type
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                        Value
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {
                                rows.map((row) => (
                                    <TableRow>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.value}</TableCell>
                                    </TableRow>
                                ))
                            }
                            <TableRow >
                                <TableCell colSpan={3}>
                                    <Box sx={{display:'flex', justifyContent:'center'}}>
                                        <Button>
                                            <AddCircle/>
                                        </Button>    
                                    </Box>                        
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }


    return (
        <Box sx ={{width:'100%', height:'100%'}}>
            <Button onClick={handleToggleProperty} sx={{position:'absolute', right:0, zIndex: 999}}>
                Open Property
            </Button>
            <Box sx={{height:'100%', display:'flex'}}>
                <Box sx={{width:'5%', display: 'flex', flexDirection:'column', gap:'10px'}}>
                    <Tooltip title='cursor' placement='right'>
                        <Button variant='contained'>
                            <Mouse />
                        </Button>
                    </Tooltip>
                    <Tooltip title='add vertex' placement='right'> 
                        <Button variant='contained'>
                            <Circle />
                        </Button>
                    </Tooltip>
                    <Tooltip title='remove vertex' placement='right'>
                        <Button variant='contained'>
                            <RemoveCircle />
                        </Button>
                    </Tooltip>

                    <Tooltip title='polyline' placement='right'>
                        <Button variant='contained'>
                            <Timeline />
                        </Button>
                    </Tooltip>

                    <Tooltip title='add subregion' placement='right'>
                        <Button variant='contained'>
                            <AddLocation />
                        </Button>
                    </Tooltip>
                    <Tooltip title='remove subregion' placement='right'>
                        <Button variant='contained'>
                            <WrongLocation />
                        </Button>
                    </Tooltip>
                    <Tooltip title='merge subregion' placement='right'>
                        <Button variant='contained'>
                            <Merge />
                        </Button>
                    </Tooltip>
                    <Tooltip title='undo' placement='right'>
                        <Button variant='contained'>
                            <Undo />
                        </Button>
                    </Tooltip>
                    <Tooltip title='redo' placement='right'>
                        <Button variant='contained'>
                            <Redo />
                        </Button>
                    </Tooltip>
                </Box>
                <Box sx ={leafletSize}>
                    {/** The ONLY use React leaflet will have is to initialize the map */}
                    <MapContainer center={[0,0]} zoom={0} doubleClickZoom={false} ref={mapRef}
                        id="mapId" style={{width:'100%', height:'100%'}}>
                            <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                            <GeoJSON 
                                key={hash(mapFile)} 
                                data={mapFile} 
                                />
                    </MapContainer>
                    {/* <div>
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
                        <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
                        <div id="map"></div>    
                    </div> */}

                </Box>
                {propertyComponent}

            </Box>


        </Box>


    )
}