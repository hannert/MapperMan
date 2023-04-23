import { Circle } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import CancelButton from "./CancelButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, unselectTool } from "../../../app/store-actions/leafletEditing";


export default function AddVertexButton(){
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Add Vertex Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.addVertex));
    }

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.addVertex){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Add Vertex' placement='right'> 
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Circle />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>
    )
}