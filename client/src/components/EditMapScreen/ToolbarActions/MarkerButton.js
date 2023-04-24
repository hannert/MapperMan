import RoomIcon from '@mui/icons-material/Room';
import { Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { editTools, endMarker, setEditTool, startMarker } from '../../../app/store-actions/leafletEditing';
import CancelButton from './CancelButton';


export default function MarkerButton() {
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Marker Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.marker));
        dispatch(startMarker())
    }
    
    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.marker){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Polyline' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <RoomIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endMarker}/>}
        </Box>
    );
}