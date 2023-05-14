import { Merge } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, setMergeArray, startMergeTool, unselectTool } from "../../../app/store-actions/leafletEditing";

export default function MergeSubregionButton() {

    const [hidden, setHidden] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const mergeArray = useSelector(state => state.leafletEditing.mergeArray)

    useEffect(() => {
        if(currentEditTool === editTools.mergeSubregions){
            console.log("merge array changed, reflowing change")
            dispatch(startMergeTool(handleMergeClick))
        }
        
    }, [mergeArray])

    function handleButtonClick(){
        console.log('Merge Subregions Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.mergeSubregions));
        setDisabled(true);
        dispatch(startMergeTool(handleMergeClick))
    }

    function handleMergeClick(e){
        let leafletID = e.target._leaflet_id

        console.log(leafletID);
        console.log(mergeArray)
        if(mergeArray.length === 0){
            console.log("Empty list")
            dispatch(setMergeArray([leafletID]))
        }
        else if (mergeArray.length === 1){
            if(mergeArray.includes(leafletID)){
                dispatch(setMergeArray([]))
            } else {
                console.log("One item in list")
                let temp = [... mergeArray];
                temp.push(leafletID)
                console.log(temp)
                dispatch(setMergeArray(temp))
            }
            
        }
        else if (mergeArray.length === 2){
            // If the mergeArray currently has two features already in it, keep most recent one
            if(mergeArray.includes(leafletID)){
                // If the currently clicked region is in the first place, slide back second place to first
                if(mergeArray[0] === leafletID){
                    dispatch(setMergeArray([mergeArray[1]]))
                } else {
                    dispatch(setMergeArray([mergeArray[0]]))
                }
            } else {
                let temp = [];
                temp.push(mergeArray[1]); 
                temp.push(leafletID);
                dispatch(setMergeArray(temp));
            }
        }
    }



    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if(currentEditTool === null){
            setDisabled(false);
        }else if (currentEditTool !== editTools.mergeSubregions){
            setHidden(true);
            setDisabled(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Merge Subregions' placement='right'>
                <Button disabled={disabled} onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                    backgroundColor:'#2B2B2B',
                    filter: 'brightness(1)',
                    }}}>
                    <Merge />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>
    );
}