import { Box } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';


export default function CollaboratorGroup(props){
    const { open, toggleCollaboratorDialog } = props;
    const dispatch = useDispatch();

    const [currentUsers, setCurrentUsers] = useState([])


    return (
        <>
            {currentUsers.map((user) => {
                <Box sx={{backgroundColor:'red'}}>
                    {user.username}
                </Box>
            })}
            {currentUsers.length}
        </>
    )
}