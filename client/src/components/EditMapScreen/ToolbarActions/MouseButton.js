import { Mouse } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import CancelButton from "./CancelButton";

export default function MouseButton(){

    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Mouse Button Clicked');
        setHidden(false);
    }
    
    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Cursor' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Mouse />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Mouse Button Cancelled')}}/>}
        </Box>

    )
}