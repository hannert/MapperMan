import { RemoveCircle } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CancelButton from "./CancelButton";


export default function RemoveVertexButton(){

    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Remove Vertex Button Clicked');
        setHidden(false);
    }

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Remove Vertex' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <RemoveCircle />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Remove Vertex Button Cancelled')}}/>}
        </Box>
    )
}