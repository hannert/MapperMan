import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, removeFeature, setChosenForDeletion, setEditTool, setLayerClickedEditor, setLayerClickedId, startMouseTracking, startRemoveTool, stopMouseTracking, unselectTool } from "../../../app/store-actions/leafletEditing";

export default function RemoveFeatureButton() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const layerGroup = useSelector(state => state.leafletEditing.layerGroup);
    const chosenForDeletion = useSelector(state => state.leafletEditing.chosenForDeletion);

    function handleButtonClick(){
        console.log('Remove Feature Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.removeFeature));
        // startMouseTracking((e)=>{dispatch(removeFeature(e.latlng))})
        dispatch(startRemoveTool(RemoveFeature));
    }
    
    const RemoveFeature = (e) => {
        if(chosenForDeletion !== null){
            console.log('removeFeature');
            console.log(chosenForDeletion);
            dispatch(setChosenForDeletion(null))
            dispatch(removeFeature(e.latlng));
        }else{
            console.log('chooseFeature');
            e.target.setStyle({ color: "red" });
            e.target.enableEdit();
            console.log(e.target._leaflet_id);
            dispatch(setChosenForDeletion(e.target._leaflet_id));
        }
    }

    useEffect(()=>{
        if (chosenForDeletion !== null){
            dispatch(setLayerClickedEditor(layerGroup.getLayer(chosenForDeletion).editor));
        }
        console.log('Onclick readded')
        dispatch(startRemoveTool(RemoveFeature));
    }, [chosenForDeletion])

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.removeFeature){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Remove Feature' placement='right'>
                <Button onClick = {handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <ClearIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>
    );
}