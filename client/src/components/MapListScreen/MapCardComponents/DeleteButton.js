import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * This component deletes a map. Will call store commands to delete the map from the database and the user's repository
 * as well as the public repository. 
 * @returns Delete Button for Map Card Actions
 */
export default function DeleteButton(){
    function handleDelete(e){
        e.stopPropagation();
    }

    function mouseDown(e){
        e.stopPropagation ();
    }

    return (
        <Button onClick={handleDelete} onMouseDown={mouseDown} style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px'}}>
            <DeleteIcon style={{fontSize:'16pt', color:'gray'}} />
        </Button>  
    )
}