import { Button } from '@mui/material';
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { getMapByIdThunk } from '../../app/store-actions/editMapList';

import 'leaflet-editable';

import { enqueueSnackbar } from 'notistack';
import { setCollaborators, setCurrentGeoJSON, setSharedWith, applyDelta, editPropertyValue, deleteProperty, addProperty } from '../../app/store-actions/leafletEditing';
import { SocketContext } from '../../socket';
import LeafletContainer from './LeafletContainer';
import MergeStatus from './MergeStatus';
import PropertyEditor from './PropertyEditor';
import Toolbar from './ToolbarActions/Toolbar';


export default function EditScreen(){

    const [propertyOpen, setPropertyOpen] = useState(false)
    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const featureIndex = useSelector((state)=>state.leafletEditing.featureClickedIndex);
    // const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const { id } = useParams();


    useEffect(() => {
        if (mapId) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!id')
            dispatch(getMapByIdThunk({id: mapId})).unwrap().then(async(response) => {
                dispatch(setCurrentGeoJSON(response.map.mapData));
                dispatch(setSharedWith(response.map.sharedWith))
            }).catch((error) => {
                console.log(error);
            });
            //  If there is a map, we connect to the server if it is shared
            // Add condition to the connection
            socket.connect()
            console.log('MapID in the useEffect', mapId)
            // At this point this client will be connected to the server 
            // Now we try to join the room created with the mapID (unique)
            socket.emit('join room', mapId)
        }
        else if (!mapId && id) {
            console.log('----------------------------------------- id')
            dispatch(getMapByIdThunk({id: id})).unwrap().then(async(response) => {
                dispatch(setCurrentGeoJSON(response.map.mapData));
            }).catch((error) => {
                console.log(error);
            });
            //  If there is a map, we connect to the server if it is shared
            // Add condition to the connection
            socket.connect()
            console.log('MapID in the useEffect', id)
            // At this point this client will be connected to the server 
            // Now we try to join the room created with the mapID (unique)
            socket.emit('join room', id)
        }

    }, [mapId, id])

    useEffect(()=>{
        socket.on('Successfully joined room', (users) => {
            enqueueSnackbar('Successfully joined room', {variant:'success', autoHideDuration:1000})
            dispatch(setCollaborators(users))
        })
        socket.on('other user joined', (users) => {
            enqueueSnackbar('Other user joined', {variant:'info', autoHideDuration:1000})
            dispatch(setCollaborators(users))
        })
        /**deprecated for now */
        socket.on('emit delta', (delta)=>{
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('received delta?!');
            console.log(delta);
            dispatch(applyDelta(delta));
        })

        socket.on('edited property', (featureIndex, key, value)=>{
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('received edit prop');
            dispatch(editPropertyValue({
                key: key,
                value: value,
                featureIndex: featureIndex
            }))
        })

        socket.on('deleted property', (featureIndex, key)=>{
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('received delete prop');
            dispatch(deleteProperty({
                key: key,
                featureIndex: featureIndex
            }))
        })

        socket.on('added property', (featureIndex, key, value)=>{
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('received add prop');
            dispatch(addProperty({
                key: key,
                value: value,
                featureIndex: featureIndex
            }))
        })

    }, [])
    
    

    let leafletSize = ''

    if (propertyOpen === true) {
        leafletSize = {width:'65%', height: '100%'}
    }
    if (propertyOpen === false) {
        leafletSize = {width:'100%', height: '100%', margin:'auto'}
    }


    function handleToggleProperty () {
        if(featureIndex!=null){
            setPropertyOpen(!propertyOpen);
        }
    }


    let propertyComponent = '';
    if (propertyOpen === true) {
        propertyComponent = <PropertyEditor handleToggleProperty={handleToggleProperty}/>
    }


    return (
        <Box sx ={{width:'100%', height:'100%'}}>
            <Button variant='contained' onClick={handleToggleProperty} sx={{position:'absolute', right:0, zIndex: 999}}>
                Open Property
            </Button>
            <Box sx={{height:'100%', display:'flex', position:'relative'}}>
                <Toolbar></Toolbar>
                <Box sx ={leafletSize}>
                    <script src="https://npmcdn.com/leaflet.path.drag/src/Path.Drag.js"></script>
                    <LeafletContainer></LeafletContainer>
                </Box>
                {propertyComponent}
                <MergeStatus />
            </Box>
            


        </Box>


    )
}