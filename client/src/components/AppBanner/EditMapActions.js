import { Delete, Edit, Groups, Publish, Save } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { Box, Container } from '@mui/system';
import { useState } from "react";
import { useSelector } from "react-redux";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import PublishModal from "./PublishModal";
import CollaboratorModal from "./CollaboratorModal";
/**
 * This component is a container for the buttons that appear on App Banner when on the EditScreen
 * Responsible for conditional rendering of the buttons. 
 * @returns Box of all of the ViewMapScreen AppBanner Actions
 */
export default function EditMapActions () {
    // Should contain the edit name button and delete button
    // Contains state on if modals are open

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [collaboratorDialogOpen, setCollaboratorDialogOpen] = useState(false);

    const mapName = useSelector((state) => state.editMapList.activeMapName)

    const toggleEditDialog = () => {
        setEditDialogOpen(!editDialogOpen)
    }
    const toggleDeleteDialog = () => {
        setDeleteDialogOpen(!deleteDialogOpen)
    }
    const togglePublishDialog = () => {
        setPublishDialogOpen(!publishDialogOpen)
    }
    const toggleCollaboratorDialog = () => {
        setCollaboratorDialogOpen(!collaboratorDialogOpen)
    }



    //  Function to handle user clicking the save icon, Should save and give notification
    function handleSave(){
        console.log("Save map");
    }

    let editDialog = "";
    editDialog = (editDialogOpen) ? <EditModal open={true} toggleEditDialog={toggleEditDialog}/> : <EditModal open={false} toggleEditDialog={toggleEditDialog}/> ;

    let deleteDialog = "";
    deleteDialog = (deleteDialogOpen) ? <DeleteModal open={true} toggleDeleteDialog={toggleDeleteDialog}/> : <DeleteModal open={false} toggleDeleteDialog={toggleDeleteDialog}/> ;

    let publishDialog = "";
    publishDialog = (publishDialogOpen) ? <PublishModal open={true} togglePublishDialog={togglePublishDialog}/> : <PublishModal open={false} togglePublishDialog={togglePublishDialog}/> ;

    let collaboratorDialog = "";
    collaboratorDialog = (collaboratorDialogOpen) ? <CollaboratorModal open={true} toggleCollaboratorDialog={toggleCollaboratorDialog}/> : <CollaboratorModal open={false} toggleCollaboratorDialog={toggleCollaboratorDialog}/> ;

    return (
        <Container>
            <Box>
                <Tooltip title='Add collaborators'>
                    <IconButton>
                        <Groups onClick={toggleCollaboratorDialog}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title='Edit map name'>
                    <IconButton>
                        <Edit onClick={toggleEditDialog} />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Delete map'>
                    <IconButton >
                        <Delete onClick={toggleDeleteDialog} />
                    </IconButton>
                </Tooltip>    
                <Tooltip title='Publish map'>
                    <IconButton>
                        <Publish onClick={togglePublishDialog} />
                    </IconButton>
                </Tooltip>    
                <Tooltip title='Save map'>
                    <IconButton>
                        <Save onClick={handleSave} />
                    </IconButton>
                </Tooltip>    
            </Box>

            {editDialog}
            {deleteDialog}
            {publishDialog}
            {collaboratorDialog}
        </Container>
    )
}