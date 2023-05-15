import { Delete, Edit, Groups, Publish, Save } from "@mui/icons-material";
import StyleIcon from '@mui/icons-material/Style';
import { IconButton, Tooltip } from "@mui/material";
import { Box, Container } from '@mui/system';
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveGeojsonThunk } from "../../app/store-actions/leafletEditing";
import CollaboratorGroup from "./CollaboratorGroup.js";
import CollaboratorModal from "./CollaboratorModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import ExportMapButton from "./ExportMapButton";
import PublishModal from "./PublishModal";
import TagsModal from "./TagsModal";
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
    const [tagDialogOpen, setTagDialogOpen] = useState(false);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
    const user = useSelector((state) => state.accountAuth.user);
    const mapId = useSelector((state) => state.editMapList.activeMapId);

    const dispatch = useDispatch
    ()
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
        console.log(user)
        setCollaboratorDialogOpen(!collaboratorDialogOpen)
    }
    const toggleTagDialog = () => {
        setTagDialogOpen(!tagDialogOpen)
    }
    

    //  Function to handle user clicking the save icon, Should save and give notification
    function handleSave(){
        var geoJSON = null;
        try {
            geoJSON = layerGroup.toGeoJSON();
        } catch(e) {
            console.log(e)
            // enqueueSnackbar('Error while trying to convert map!', {variant:'error'})
        }
        if (geoJSON === null) return


        const layers = layerGroup.getLayers()
        console.log(layers);
        console.log('Geojson here');
        console.log(geoJSON);

        let copy = {}
    
        for(let i in layers){
            geoJSON.features[i].properties = layers[i].properties
        }
        console.log('Copy here')
        console.log(copy);
        
        console.log(user);
        console.log(geoJSON);
        console.log(mapId);

        dispatch(saveGeojsonThunk({
            owner: user, 
            mapData: geoJSON, 
            id: mapId}
            )).unwrap().then((response) => {
                enqueueSnackbar('Map successfully saved!', {variant:'success'})
                console.log(response);
        }).catch((error) => {
            enqueueSnackbar('Error while trying to save map!', {variant:'error'})
            console.log(error);
        });

        console.log(geoJSON);    
    }

    let editDialog = "";
    editDialog = (editDialogOpen) ? <EditModal open={true} toggleEditDialog={toggleEditDialog}/> : <EditModal open={false} toggleEditDialog={toggleEditDialog}/> ;

    let deleteDialog = "";
    deleteDialog = (deleteDialogOpen) ? <DeleteModal open={true} toggleDeleteDialog={toggleDeleteDialog}/> : <DeleteModal open={false} toggleDeleteDialog={toggleDeleteDialog}/> ;

    let publishDialog = "";
    publishDialog = (publishDialogOpen) ? <PublishModal open={true} togglePublishDialog={togglePublishDialog}/> : <PublishModal open={false} togglePublishDialog={togglePublishDialog}/> ;

    let collaboratorDialog = "";
    collaboratorDialog = (collaboratorDialogOpen) ? <CollaboratorModal open={true} toggleCollaboratorDialog={toggleCollaboratorDialog}/> : <CollaboratorModal open={false} toggleCollaboratorDialog={toggleCollaboratorDialog}/> ;

    let tagDialog = "";
    tagDialog = (tagDialogOpen) ? <TagsModal open={true} toggleTagDialog={toggleTagDialog}/> : <TagsModal open={false} toggleTagDialog={toggleTagDialog}/> ;
    return (
        <Container>
            <Box>
                <CollaboratorGroup />
                    
                <Tooltip title='Add collaborators'>
                    <IconButton onClick={toggleCollaboratorDialog}>
                        <Groups />
                    </IconButton>
                </Tooltip>
                
                
                <Tooltip title='Edit map name'>
                    <IconButton onClick={toggleEditDialog}>
                        <Edit  />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Delete map'>
                    <IconButton onClick={toggleDeleteDialog}>
                        <Delete  />
                    </IconButton>
                </Tooltip>    
                <Tooltip title='Publish map'>
                    <IconButton onClick={togglePublishDialog}>
                        <Publish  />
                    </IconButton>
                </Tooltip>    
                <Tooltip title='Save map'>
                    <IconButton onClick={handleSave}>
                        <Save  />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Add tags'>
                    <IconButton>
                        <StyleIcon onClick={toggleTagDialog} />
                    </IconButton>
                </Tooltip>
                <ExportMapButton />
            </Box>

            {editDialog}
            {deleteDialog}
            {publishDialog}
            {collaboratorDialog}
            {tagDialog}
        </Container>
    )
}