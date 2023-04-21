import { WrongLocation } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CancelButton from "./CancelButton";


export default function RemoveSubregionButton() {

    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Remove Subregions Button Clicked');
        setHidden(false);
    }

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Remove Subregion' placement='right'>
                <Button onClick = {handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <WrongLocation />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Remove Subregions Button Cancelled')}}/>}
        </Box>
    );
}