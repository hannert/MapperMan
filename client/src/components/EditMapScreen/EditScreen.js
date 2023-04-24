import { Button } from '@mui/material';
import { Box } from "@mui/system";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMapByIdThunk } from '../../app/store-actions/editMapList';

import 'leaflet-editable';

import { setCurrentGeoJSON } from '../../app/store-actions/leafletEditing';
import LeafletContainer from './LeafletContainer';
import MergeStatus from './MergeStatus';
import PropertyEditor from './PropertyEditor';
import Toolbar from './ToolbarActions/Toolbar';

export default function EditScreen(){

    const [propertyOpen, setPropertyOpen] = useState(false)
    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const feature = useSelector((state)=>state.leafletEditing.featureClicked);
    const dispatch = useDispatch();

    useEffect(() => {
        if (mapId) {
            dispatch(getMapByIdThunk({id: mapId})).unwrap().then(async(response) => {
                dispatch(setCurrentGeoJSON(response.map.mapData));
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
        if(feature){
            setPropertyOpen(!propertyOpen);
        }
    }




    let propertyComponent = '';
    if (propertyOpen === true) {
        propertyComponent = <PropertyEditor handleToggleProperty={handleToggleProperty}/>
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
                <MergeStatus />
            </Box>
            


        </Box>


    )
}