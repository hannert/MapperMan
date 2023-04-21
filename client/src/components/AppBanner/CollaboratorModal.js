import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Avatar, TextField } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export default function CollaboratorModal(props){
    const { open, toggleCollaboratorDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);

    function handleConfirm() {
        console.log("Confirm collab")
    }

    return (
        <Dialog open={open} onClose={toggleCollaboratorDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Share {mapName} ?</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth
                    label='Add people'
                />
            </DialogContent>
            <DialogContent>
                <Typography variant='h6'> People with access </Typography>
                <Box display='flex' gap='10px'>
                    <Avatar></Avatar>
                    <Avatar></Avatar>
                    <Avatar></Avatar>
                    <Avatar></Avatar>
                    <Avatar></Avatar>
                    <Avatar></Avatar>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button  onClick={toggleCollaboratorDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
      </Dialog>
    )
}