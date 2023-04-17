import ForkRightIcon from '@mui/icons-material/ForkRight';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import apis from '../../../app/store-requests/store_requests';

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

    const id = props.mapId
    const user = useSelector((state) => state.editMapList.user);


    function handleDelete(e){
        e.stopPropagation();
        console.log(id)

        apis.forkMap(id, user).then((res) => {
            if(res.data.success===true){
                console.log("map forked successfully");
            }else{
                console.log("map fork failed");
                console.log(res);
            }
        })
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