import HighlightOffIcon from '@mui/icons-material/HighlightOff';import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, unselectTool } from "../../../app/store-actions/leafletEditing";

export default function RemoveFeatureButton() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Remove Feature Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.removeFeature));
        
    }

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
                    <HighlightOffIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>
    );
}