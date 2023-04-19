import { Button } from '@mui/material';
import { Box } from '@mui/system';
import DeleteButton from './DeleteButton';
import ForkButton from './ForkButton';
import PublishButton from './PublishButton';
import { useSelector } from 'react-redux';

/**
 * This component is a container for the three buttons that appear on the top right of each map card.
 * Responsible for conditional rendering of the buttons. 
 * @returns Box of all of the Map Card Actions
 */
export default function MapCardActions(props){
    let {published, togglePublishDialog, handleActionClick} = props;
    const publicRepo = useSelector((state) => state.editMapList.publicRepo);

    function handleDelete(e){
        e.stopPropagation();
    }

    function mouseDown(e){
        e.stopPropagation ();
    }

    return (
        <Box>
            {!published && <PublishButton togglePublishDialog={togglePublishDialog} handleActionClick={handleActionClick}></PublishButton>}
            {published && publicRepo && <ForkButton></ForkButton>}
            {!publicRepo &&<DeleteButton></DeleteButton>}
        </Box>

    )
}