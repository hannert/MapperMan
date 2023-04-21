import { Merge } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import CancelButton from "./CancelButton";


export default function MergeSubregionButton() {

    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Merge Subregions Button Clicked');
        setHidden(false);
    }

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Merge Subregions' placement='right'>
                <Button onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                    <Merge />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Merge Subregions Button Cancelled')}}/>}

        </Box>
    );
}