import { Circle } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import CancelButton from "./CancelButton";
import { useState } from "react";


export default function AddVertexButton(){
    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Add Vertex Button Clicked');
        setHidden(false);
    }

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Add Vertex' placement='right'> 
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Circle />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Add Vertex Button Cancelled')}}/>}
        </Box>
    )
}