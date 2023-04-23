import { Mouse } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, startMouseTool, unselectTool } from "../../../app/store-actions/leafletEditing";

export default function MouseButton(){

    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Mouse Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.mouse));
        dispatch(startMouseTool());
    }
    
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
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>

    )
}