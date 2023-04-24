import { RemoveCircle } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, unselectTool } from "../../../app/store-actions/leafletEditing";

export default function RemoveVertexButton(){

    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Remove Vertex Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.removeVertex));
    }

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.removeVertex){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Remove Vertex' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <RemoveCircle />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>
    )
}