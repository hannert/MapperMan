import AddCircleIcon from '@mui/icons-material/AddCircle';import { Box, Button, Tooltip } from "@mui/material";
import CancelButton from "./CancelButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVertex, editTools, setEditTool, startMouseTracking, stopMouseTracking, unselectTool } from "../../../app/store-actions/leafletEditing";


export default function AddVertexButton(){
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const layerClickedEditor = useSelector(state => state.leafletEditing.layerClickedEditor);

    function handleButtonClick(){
        console.log('Add Vertex Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.addVertex));
        dispatch(startMouseTracking(handleAddVertexButton));
    }

    const handleAddVertexButton = (e) => {
        // console.log(layerClickedEditor);
        // if(layerClickedEditor !== null){
        //     console.log(e.latlng);
        //     layerClickedEditor.push(e.latlng);
        // }
        // dispatch(addVertex(e.latlng));
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
                    <AddCircleIcon/>
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{
                dispatch(unselectTool());
                dispatch(stopMouseTracking());
            }}/>}
        </Box>
    )
}