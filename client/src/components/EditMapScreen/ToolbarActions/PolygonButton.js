import PentagonIcon from '@mui/icons-material/Pentagon';
import { Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { editTools, endPolygonDraw, setEditTool, startPolygonDraw } from '../../../app/store-actions/leafletEditing';
import CancelButton from './CancelButton';


export default function PolygonButton() {
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Polygon Button Clicked');
        setHidden(false);
        // dispatch(startMouseTracking((e)=>{dispatch(startPolylineDraw(e.latlng))}))
        dispatch(startPolygonDraw())
    }
    
    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.polygon){
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Polyline' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <PentagonIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endPolygonDraw}/>}
        </Box>
    );
}