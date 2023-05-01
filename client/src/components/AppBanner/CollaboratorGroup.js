import { useSelector } from 'react-redux';

export default function CollaboratorGroup(props){
    const collaborators = useSelector((state)=>state.leafletEditing.collaborators);

    return (
        <>
            {collaborators?.length}
        </>
    )
}