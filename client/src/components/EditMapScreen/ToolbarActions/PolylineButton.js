import { Timeline } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CancelButton from "./CancelButton";


export default function PolylineButton(){

    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Polyline Button Clicked');
        setHidden(false);
    }
    

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Draw Polyline' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Timeline />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Polyline Button Cancelled')}}/>}
        </Box>
    )
}