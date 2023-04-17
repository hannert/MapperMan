import PublishIcon from '@mui/icons-material/Publish';
import { Button } from '@mui/material';

/**
 * This component publishes a map. Will call store commands to change the map's published status
 * in the database
 * @returns Publish Button for Map Card Actions
 */
export default function PublishButton(){
    function handleDelete(e){
        e.stopPropagation();
    }

    function mouseDown(e){
        e.stopPropagation ();
    }

    return (
        <Button onClick={handleDelete} onMouseDown={mouseDown} style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px'}}>
            <PublishIcon style={{fontSize:'16pt', color:'gray'}} />
        </Button>  
    )

}