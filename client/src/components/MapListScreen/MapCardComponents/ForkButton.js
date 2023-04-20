import ForkRightIcon from '@mui/icons-material/ForkRight';
import { Button } from '@mui/material';

/**
 * This component forks a map. Will call store commands to change the map to go into the repository
 * of the user that forked it. This should only be rendered when the users on the public repository.
 * When clicked it should open a dialog for confirmation.
 * 
 * Call function to the backend to get a copy of this map, change it's published val to private, and store it into
 * the current users ownedLists in the backend.
 * 
 * @returns Fork Button for Map Card Actions
 */
export default function ForkButton(props){
    const {toggleForkDialog, handleActionClick} = props;

    // Function to stage map to be forked. Should call store to open the ForkDialog, while passing MapID.
    function handleFork(e){
        e.stopPropagation();
        console.log("Fork map button clicked")
        handleActionClick();
        toggleForkDialog();
    }

    
    return (
        <Button onClick={handleFork} style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px'}}>
            <ForkRightIcon style={{fontSize:'16pt', color:'gray'}} />
        </Button>  
    )
}