import { Undo } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { undoTransaction } from "../../../app/store-actions/transactions";
import { unselectTool } from "../../../app/store-actions/leafletEditing";
import { useEffect, useState } from "react";
export default function UndoButton() {

    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState(true);
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const tps = useSelector(state => state.transactions.tps);
    const ping = useSelector(state => state.transactions.ping);

    function handleClick(){
        dispatch(undoTransaction());
        // undoDisabled = !tps.hasTransactionToUndo();
        // console.log('undo disabled: ' + undoDisabled);
    }

    useEffect(()=>{
        if(currentEditTool === null){
            setDisabled(false);
        }else{
            setDisabled(true);            
        }
    }, [currentEditTool])
    
    useEffect(()=>{
        if(tps !== null){
            if(currentEditTool === null){
                let undoDisabled = !tps.hasTransactionToUndo();
                setDisabled(undoDisabled);
                console.log('undoDisabled: ' + undoDisabled);
            }
        }
    }, [ping])

    return (
        <Tooltip enterDelay={1000} title='Undo Edit' placement='right'>
            <Button disabled={disabled} onClick={handleClick} variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                    backgroundColor:'#2B2B2B',
                    filter: 'brightness(1)',
                    }}}>
                <Undo />
            </Button>
        </Tooltip>
    );
}