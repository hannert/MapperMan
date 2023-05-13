import { Undo } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { undoTransaction } from "../../../app/store-actions/transactions";
import { unselectTool } from "../../../app/store-actions/leafletEditing";
export default function UndoButton() {

    const dispatch = useDispatch();

    function handleClick(){
        // dispatch(unselectTool())
        dispatch(undoTransaction());
    }

    return (
        <Tooltip enterDelay={1000} title='Undo Edit' placement='right'>
            <Button onClick={handleClick} variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                <Undo />
            </Button>
        </Tooltip>
    );
}