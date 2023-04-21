import { AddBox } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";
import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool } from "../../../app/store-actions/leafletEditing";


export default function AddSubregionButton() {
    const [hidden, setHidden] = useState(true);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);

    function handleButtonClick(){
        console.log('Add Subregion Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.addSubregion));
    }

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if (currentEditTool !== editTools.addSubregion){
            setHidden(true);
        }
    }, [currentEditTool])

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