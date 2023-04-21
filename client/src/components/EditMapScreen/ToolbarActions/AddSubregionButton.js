import { AddBox } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import CancelButton from "./CancelButton";


export default function AddSubregionButton() {
    const [hidden, setHidden] = useState(true);

    function handleButtonClick(){
        console.log('Add Subregion Button Clicked');
        setHidden(false);
    }

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title="Add Subregion" placement="right">
                <Button onClick={handleButtonClick} variant="contained" sx={{backgroundColor:'#2B2B2B'}}>
                    <AddBox />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={()=>{console.log('Add Subregion Button Cancelled')}}/>}
        </Box>
    );
}