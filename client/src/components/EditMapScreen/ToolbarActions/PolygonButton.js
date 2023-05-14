import PentagonIcon from '@mui/icons-material/Pentagon';
import { Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { editTools, endPolygonDraw, incrementFeatureIndex, setEditTool, startPolygonDraw, unselectTool, updateProperties } from '../../../app/store-actions/leafletEditing';
import CancelButton from './CancelButton';
import * as L from 'leaflet';
import CommitButton from './CommitButton';

export default function PolygonButton() {
    const [hidden, setHidden] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const activeDrawing = useSelector(state => state.leafletEditing.activeDrawing);

    function handleButtonClick(){
        dispatch(unselectTool());
        console.log('Polygon Button Clicked');
        setHidden(false);
        setDisabled(true);
        dispatch(setEditTool(editTools.polygon))
        dispatch(startPolygonDraw())
    }
    
    function endTool(){
        dispatch(updateProperties({
            properties: {name: 'New Polygon'}
        }))
        activeDrawing.disableEdit();
        dispatch(unselectTool());
    }

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if(currentEditTool === null){
            console.log('Enabling polygon')
            setDisabled(false);
        }else if (currentEditTool !== editTools.polygon){
            setDisabled(true);
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Polygon' placement='right'>
                <Button disabled={disabled} onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                backgroundColor:'#2B2B2B',
                filter: 'brightness(1)',
                } }}>
                    <PentagonIcon />
                </Button>
            </Tooltip>
            { !hidden && <CommitButton setHidden={setHidden} cancelFunction={endTool}/>}
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endTool}/>}
        </Box>
    );
}