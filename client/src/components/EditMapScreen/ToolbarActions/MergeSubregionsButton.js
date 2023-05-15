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
    const mergeIndexArray = useSelector(state => state.leafletEditing.mergeIndexArray)
    const mergeIdArray = useSelector(state => state.leafletEditing.mergeIdArray)

    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);



    useEffect(() => {
        if(currentEditTool === editTools.mergeSubregions){
            console.log("merge array changed, reflowing change")
            dispatch(startMergeTool(handleMergeClick))
        }
        
    }, [mergeIndexArray])

    function handleButtonClick(){
        console.log('Merge Subregions Button Clicked');
        setHidden(false);
        dispatch(setEditTool(editTools.mergeSubregions));
        setDisabled(true);
        dispatch(startMergeTool(handleMergeClick))
    }

    function handleMergeClick(e){
        let leafletID = e.target._leaflet_id
        console.log(layerGroup)
        console.log(e.target)
        let index = null;
        let j = 0;
        for(let [i, layers] of Object.entries(layerGroup._layers)){
            let layer = layerGroup._layers[i]
            if(layer._leaflet_id === e.target._leaflet_id){
                console.log('Found a matching leafet id at index:', i)
                index = j
            }
            j++;
                
            
        }
        console.log(mergeIdArray)
        if(mergeIdArray.length === 0){
            console.log("Empty list")
            dispatch(setMergeArray({'mergeIdArray': [leafletID], 'mergeIndexArray': [index]}))
        }
        else if (mergeIdArray.length === 1){
            if(mergeIdArray.includes(leafletID)){
                dispatch(setMergeArray({'mergeIdArray': [], 'mergeIndexArray': []}))
            } else {
                console.log("One item in list")
                let tempIndex = [... mergeIndexArray];
                tempIndex.push(index)
                let tempId = [... mergeIdArray];
                tempId.push(leafletID)
                dispatch(setMergeArray({'mergeIdArray': tempId, 'mergeIndexArray': tempIndex}))
            }
            
        }
        else if (mergeIdArray.length === 2){
            // If the mergeArray currently has two features already in it, keep most recent one
            if(mergeIdArray.includes(leafletID)){
                // If the currently clicked region is in the first place, slide back second place to first
                if(mergeIdArray[0] === leafletID){
                    dispatch(setMergeArray({'mergeIdArray': [mergeIdArray[1]], 'mergeIndexArray': [mergeIndexArray[1]]}))
                } else {
                    dispatch(setMergeArray({'mergeIdArray': [mergeIdArray[0]], 'mergeIndexArray': [mergeIndexArray[0]]}))
                }
            } else {
                let tempId = [];
                tempId.push(mergeIdArray[1]); 
                tempId.push(leafletID);
                let tempIndex = [];
                tempIndex.push(mergeIndexArray[1]);
                tempIndex.push(index)

                dispatch(setMergeArray({'mergeIdArray': tempId, 'mergeIndexArray': tempIndex}));
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