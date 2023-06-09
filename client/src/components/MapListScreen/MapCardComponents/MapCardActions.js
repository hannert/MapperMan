import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import DeleteButton from './DeleteButton';
import ForkButton from './ForkButton';
import PublishButton from './PublishButton';

/**
 * This component is a container for the three buttons that appear on the top right of each map card.
 * Responsible for conditional rendering of the buttons. 
 * @returns Box of all of the Map Card Actions
 */
export default function MapCardActions(props){
    let {mapId, owner, published, togglePublishDialog, toggleDeleteDialog, toggleForkDialog, handleActionClick} = props;
    const publicRepo = useSelector((state) => state.editMapList.publicRepo);
    const guest = useSelector((state) => state.accountAuth.guest);
    const user = useSelector((state) => state.accountAuth.user);
    let temp = true
    if (user === null || guest){
        temp = false
    }
    console.log(owner)
    return (
        <Box sx={{marginRight:'5%'}}>
            {!published && !guest && <PublishButton togglePublishDialog={togglePublishDialog} handleActionClick={handleActionClick}></PublishButton>}
            {published && !guest && <ForkButton toggleForkDialog={toggleForkDialog} handleActionClick={handleActionClick}></ForkButton>}
            {!publicRepo && temp && (user !== null && user.username === owner) && <DeleteButton toggleDeleteDialog={toggleDeleteDialog} handleActionClick={handleActionClick}></DeleteButton>}
        </Box>

    )
}