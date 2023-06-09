import { Mouse } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, setLayerClickedId, unselectTool } from "../../../app/store-actions/leafletEditing";
import CancelButton from "./CancelButton";

export default function MouseButton(){

    const [hidden, setHidden] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        dispatch(unselectTool());
        console.log('Mouse Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.mouse));
        setDisabled(true);

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

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if(currentEditTool === null){
            setDisabled(false);
        }else if (currentEditTool !== editTools.mouse){
            setHidden(true);
            setDisabled(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Cursor' placement='right'>
                <Button disabled={disabled} onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                    backgroundColor:'#2B2B2B',
                    filter: 'brightness(1)',
                    }}}>
                    <Mouse />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{dispatch(unselectTool)}}/>}
        </Box>

    )
}