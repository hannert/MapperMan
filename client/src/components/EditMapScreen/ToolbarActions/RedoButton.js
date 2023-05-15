import { Redo } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { doTransaction } from "../../../app/store-actions/transactions";
import { unselectTool } from "../../../app/store-actions/leafletEditing";
import { useEffect, useState } from "react";
export default function RedoButton() {

    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState(false);
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const tps = useSelector(state => state.transactions.tps);
    const ping = useSelector(state => state.transactions.ping);

    function handleClick(){
        // dispatch(unselectTool())
        dispatch(doTransaction());
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
                let redoDisabled = !tps.hasTransactionToRedo();
                setDisabled(redoDisabled);
                console.log('undoDisabled: ' + redoDisabled);
            }
        }
    }, [ping])


    return (
        <Tooltip enterDelay={1000} title='Redo Edit' placement='right'>
            <Button disabled={disabled} onClick={handleClick}variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                    backgroundColor:'#2B2B2B',
                    filter: 'brightness(1)',
                    }}}>
                <Redo />
            </Button>
        </Tooltip>
    );
}