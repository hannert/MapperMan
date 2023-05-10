import { Mouse } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";
import * as L from 'leaflet';
import { useDispatch, useSelector } from "react-redux";
import { editTools, setDraggable, setEditTool, setFeatureIndexClicked, setLayerClickedEditor, setLayerClickedId, startMouseTool, unselectTool } from "../../../app/store-actions/leafletEditing";

export default function MouseButton(){

    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    // const layerClickedId = useSelector(state => state.leafletEditing.layerClickedId);
    const layerGroup = useSelector(state => state.leafletEditing.layerGroup);
    const featureIndex = useSelector(state => state.leafletEditing.featureClickedIndex);

    function handleButtonClick(){
        dispatch(unselectTool());
        console.log('Mouse Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.mouse));

        // dispatch(startMouseTool(handleMouseClick));
    }
    
    const handleMouseClick = (e) => {
        if(e.target.editEnabled()){
            e.target.setStyle({ color: "#3388ff" });
            e.target.disableEdit();
            dispatch(setLayerClickedId(null));
        }else{
            e.target.setStyle({ color: "black" });
            e.target.enableEdit();
            dispatch(setLayerClickedId(e.target._leaflet_id));
        }
    }

    // useEffect(()=>{
    //     if (featureIndex !== null){
    //         console.log("stuff");
    //     }
    // }, [featureIndex])

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.mouse){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Cursor' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Mouse />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{dispatch(unselectTool)}}/>}
        </Box>

    )
}