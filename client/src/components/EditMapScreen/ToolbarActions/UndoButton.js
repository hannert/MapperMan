import { Undo } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";


export default function UndoButton() {
    return (
        <Tooltip enterDelay={1000} title='Undo Edit' placement='right'>
            <Button variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                <Undo />
            </Button>
        </Tooltip>
    );
}