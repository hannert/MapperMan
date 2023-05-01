import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function CollaboratorGroup(props){
    const collaborators = useSelector((state)=>state.leafletEditing.collaborators);

    const [currentUsers, setCurrentUsers] = useState([])

    useEffect(()=>{
        setCurrentUsers(collaborators)
    }, collaborators)

    return (
        <>
            <Box>Hello</Box>
            {collaborators?.length}
        </>
    )
}