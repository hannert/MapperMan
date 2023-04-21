import { Redo } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";


export default function RedoButton() {
    
    return (
        <Tooltip enterDelay={1000} title='Redo Edit' placement='right'>
            <Button variant='contained' sx={{backgroundColor:'#2B2B2B'}}>
                <Redo />
            </Button>
        </Tooltip>
    );
}