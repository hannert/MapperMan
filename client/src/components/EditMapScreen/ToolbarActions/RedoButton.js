import { Redo } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { doTransaction } from "../../../app/store-actions/transactions";
import { unselectTool } from "../../../app/store-actions/leafletEditing";
export default function RedoButton() {

    const dispatch = useDispatch();

    function handleClick(){
        // dispatch(unselectTool())
        dispatch(doTransaction());
    }

    return (
        <Tooltip enterDelay={1000} title='Redo Edit' placement='right'>
            <Button onClick={handleClick}variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                <Redo />
            </Button>
        </Tooltip>
    );
}