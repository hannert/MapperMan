import { Box, Button, LinearProgress } from "@mui/material";
import { useEffect, useState, useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTools, mergeRegion } from '../../app/store-actions/leafletEditing';
import { SocketContext } from "../../socket";

export default function MergeStatus() {

    const editTool = useSelector((state) => state.leafletEditing.editTool);
    const mergeArray = useSelector((state) => state.leafletEditing.mergeIndexArray);
    const mergeFeature = useSelector((state) => state.leafletEditing.mergeFeature);
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const activeDrawing = useSelector(state => state.leafletEditing.activeDrawing);
    const socket = useContext(SocketContext);
    const mapId = useSelector((state) => state.editMapList.activeMapId);

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
        dispatch(mergeRegion({'dispatch': dispatch,'socket':socket,'mapId': mapId}))
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