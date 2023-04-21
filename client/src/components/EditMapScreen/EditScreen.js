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

import { setCurrentGeoJSON } from '../../app/store-actions/leafletEditing';
import LeafletContainer from './LeafletContainer';
import Toolbar from './ToolbarActions/Toolbar';


export default function EditScreen(){

    const [propertyOpen, setPropertyOpen] = useState(false)
    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const dispatch = useDispatch();

    useEffect(() => {
        if (mapId) {
            dispatch(getMapByIdThunk({id: mapId})).unwrap().then(async(response) => {
                dispatch(setCurrentGeoJSON(response.map.mapData))
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
        leafletSize = {width:'100%', height: '100%', margin:'auto'}
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
            <Box sx={{height:'100%', display:'flex', position:'relative'}}>
                <Toolbar></Toolbar>
                <Box sx ={leafletSize}>
                    <LeafletContainer></LeafletContainer>
                </Box>
                {propertyComponent}
            </Box>


        </Box>


    )
}