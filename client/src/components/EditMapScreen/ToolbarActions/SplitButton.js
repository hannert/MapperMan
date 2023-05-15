import CallSplitIcon from '@mui/icons-material/CallSplit';
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { editTools, setEditTool, startSplit, unselectTool, endSplit, updateProperties } from '../../../app/store-actions/leafletEditing';
import CancelButton from './CancelButton';
import CommitButton from './CommitButton';

export default function SplitButton() {
    const [hidden, setHidden] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const activeDrawing = useSelector(state => state.leafletEditing.activeDrawing);

    function handleButtonClick(){
        dispatch(unselectTool());
        console.log('splitSubregions Button Clicked');
        setHidden(false);
        setDisabled(true);
        dispatch(setEditTool(editTools.splitSubregions))
        dispatch(startSplit())
    }
    
    function endTool(){
        dispatch(endSplit(dispatch));
        dispatch(unselectTool());
    }

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if(currentEditTool === null){
            console.log('Enabling split')
            setDisabled(false);
        }else if (currentEditTool !== editTools.splitSubregions){
            setDisabled(true);
            setHidden(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Split polygon' placement='right'>
                <Button disabled={disabled} onClick={handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                backgroundColor:'#2B2B2B',
                filter: 'brightness(1)',
                } }}>
                    <CallSplitIcon />
                </Button>
            </Tooltip>
            { !hidden && <CommitButton setHidden={setHidden} cancelFunction={endTool}/>}
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={endTool}/>}
        </Box>
    );
}