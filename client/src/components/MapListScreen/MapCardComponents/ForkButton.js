import ForkRightIcon from '@mui/icons-material/ForkRight';
import { Button } from '@mui/material';

/**
 * This component forks a map. Will call store commands to change the map to go into the repository
 * of the user that forked it. 
 * @returns Fork Button for Map Card Actions
 */
export default function ForkButton(){
    function handleDelete(e){
        e.stopPropagation();
    }

    function mouseDown(e){
        e.stopPropagation ();
    }

    return (
        <Button onClick={handleDelete} onMouseDown={mouseDown} style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px'}}>
            <ForkRightIcon style={{fontSize:'16pt', color:'gray'}} />
        </Button>  
    )
}