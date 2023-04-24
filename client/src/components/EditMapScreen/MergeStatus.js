import { Box, Button, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTools, incrementFeatureIndex, mergeRegion } from '../../app/store-actions/leafletEditing';

export default function MergeStatus() {

    const editTool = useSelector((state) => state.leafletEditing.editTool);
    const mergeArray = useSelector((state) => state.leafletEditing.mergeArray);
    const mergeFeature = useSelector((state) => state.leafletEditing.mergeFeature);

    const dispatch = useDispatch();

    const [progress, setProgress] = useState(0)
    useEffect(()=>{
        if(mergeArray.length === 0){
            setProgress(0)
        } else if(mergeArray.length === 1){
            setProgress(50)
        } else if(mergeArray.length === 2){
            setProgress(100)
        }
    }, [mergeArray])

    function handleConfirm() {
        dispatch(incrementFeatureIndex());
        dispatch(mergeRegion())
    }

    let first = '';
    let second = '';
    if(mergeArray.length === 0){
        first = '';
        second = '';
    } else if(mergeArray.length === 1){
        first = mergeArray[0]
    } else if(mergeArray.length === 2){
        first = mergeArray[0]
        second = mergeArray[1]
    }

    return (
        <>
            {editTool === editTools.mergeSubregions &&
                <Box sx={{position:'absolute', bottom:0, left:'50%', marginBottom:'20px', zIndex:999}} className='Awesome'>
                    {/* Currently Merging Subregions {mergeArray[0]} and {mergeArray[1]} */}
                    <Box sx={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        <LinearProgress variant='determinate' value={progress} />
                        <Button onClick={handleConfirm} variant='contained'>
                            Merge
                        </Button>
                    </Box>
                </Box>
            }
        </>
    )
}