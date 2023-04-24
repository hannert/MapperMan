import AdjustIcon from '@mui/icons-material/Adjust';
import { Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { editTools, endCircleDraw, setEditTool, startCircleDraw } from '../../../app/store-actions/leafletEditing';
import CancelButton from './CancelButton';


export default function AddCircleButton() {
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Circle Button Clicked');
        setHidden(false);
        // dispatch(startMouseTracking((e)=>{dispatch(startPolylineDraw(e.latlng))}))
        dispatch(setEditTool(editTools.circle));
        dispatch(startCircleDraw())
    }
    
    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        console.log(currentEditTool);
        if (currentEditTool !== editTools.circle){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Circle' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <AdjustIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endCircleDraw}/>}
        </Box>
    );
}