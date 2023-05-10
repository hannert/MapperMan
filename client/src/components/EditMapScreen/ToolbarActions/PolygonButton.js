import PentagonIcon from '@mui/icons-material/Pentagon';
import { Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { editTools, endPolygonDraw, incrementFeatureIndex, setEditTool, startPolygonDraw, unselectTool, updateProperties } from '../../../app/store-actions/leafletEditing';
import CancelButton from './CancelButton';
import * as L from 'leaflet';

export default function PolygonButton() {
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const activeDrawing = useSelector(state => state.leafletEditing.activeDrawing);
    const featureIndex = useSelector(state => state.leafletEditing.featureIndex);
    const layerGroup = useSelector(state => state.leafletEditing.layerGroup);
    const mapRef = useSelector(state => state.leafletEditing.mapRef);
    const properties = useSelector(state => state.leafletEditing.properties);

    function handleButtonClick(){
        dispatch(unselectTool());

        console.log('Polygon Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.polygon))

        //TODO bandaid fix
        dispatch(startPolygonDraw())
    }
    
    function endTool(){
        dispatch(updateProperties({
            properties: {name: 'New Polygon'}
        }))
        // dispatch(endPolygonDraw())
        activeDrawing.disableEdit();
    }

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.polygon){
            setHidden(true);
            
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Polygon' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <PentagonIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endTool}/>}
        </Box>
    );
}