import { AddCircle, AddLocation, Circle, Merge, Mouse, Redo, RemoveCircle, Timeline, Undo, WrongLocation } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Box } from "@mui/system";
import hash from 'object-hash';
import React, { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import file from './NA.json';
import { useSelector } from 'react-redux';

import apis from '../app/store-requests/store_requests';

export default function EditScreen(){

    const [propertyOpen, setPropertyOpen] = useState(false)
    const map = useSelector((state) => state.editMapList.activeMap);
    // the default value in the usestate is just blank
    const [mapFile, setMapFile] = useState({
            "type": "FeatureCollection",
            "name": "jsontemplate",
            "features": [
            { "type": "Feature", "properties": { "a1": "", "a2": "", "a3": "", "a4": ""}, "geometry": null }
            ]
        });

    useEffect(() => {
        if (map) {
            apis.getMapById(map).then((response) => {
                console.log(response.data.map.mapData);
                setMapFile(response.data.map.mapData);
                console.log(mapFile);
            }
        )}   
    }, [map])

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

                    <MapContainer center={[37.09, -95.71]} zoom={4} doubleClickZoom={false}
                        id="mapId" style={{width:'100%', height:'100%'}}>
                            <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                            <GeoJSON 
                                key={hash(mapFile)} 
                                data={mapFile} 
                                />
                    </MapContainer>

                </Box>
                {propertyComponent}

            </Box>


        </Box>


    )
}