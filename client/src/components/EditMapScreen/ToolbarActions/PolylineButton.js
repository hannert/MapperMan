import { Timeline } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, incrementFeatureIndex, setEditTool, startMouseTracking, startPolylineDraw, updateProperties } from "../../../app/store-actions/leafletEditing";

export default function PolylineButton(){

    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const activeDrawing = useSelector(state => state.leafletEditing.activeDrawing);
    const mapRef = useSelector(state => state.leafletEditing.mapRef);

    function handleButtonClick(){
        console.log('Polyline Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.polyline));

        dispatch(startPolylineDraw())
        
    }

    function endPolylineDraw(){
        dispatch(updateProperties({
            properties: {name: 'New Polyline'}
        }))
        activeDrawing.disableEdit();
        mapRef.editTools.commitDrawing();
    }
    
    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.polyline){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Polyline' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Timeline />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endPolylineDraw} />}
        </Box>
    )
}