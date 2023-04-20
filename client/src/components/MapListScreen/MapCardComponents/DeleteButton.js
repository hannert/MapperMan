import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";

/**
 * This component deletes a map. Will call store commands to delete the map from the database and the user's repository
 * as well as the public repository. This should only be rendered when the user is on their own repository. Just delete
 * the map in the backend. When clicked it should open a dialog for confirmation.
 * 
 * @returns Delete Button for Map Card Actions
 */
export default function DeleteButton(props){
    const {toggleDeleteDialog, handleActionClick} = props;


    // Function to stage map to be deleted. Should call store to open the DeleteDialog, while passing MapID.
    function handleDelete(e){
        
        console.log("Delete map button clicked");
        handleActionClick();
        toggleDeleteDialog();
        e.stopPropagation();
    }




    return (
        <Button onClick={handleDelete} style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px'}}>
            <DeleteIcon style={{fontSize:'16pt', color:'gray'}} />
        </Button>  
    )
}