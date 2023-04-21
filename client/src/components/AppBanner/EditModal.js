import { DialogContent, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { renameMap, renameMapThunk } from '../../app/store-actions/editMapList';


export default function EditModal (props) {
    const {open, toggleEditDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);

    const [mapRenameField, setMapRenameField]=useState("");

    const handleRenameTextFieldChange = (event) =>{
        setMapRenameField(event.target.value);
    }
    const resetRenameTextField = () =>{
        setMapRenameField("");
    }

    const handleConfirm = () =>{
        dispatch(renameMapThunk({id: mapID, newName: mapRenameField})).unwrap().then((res)=>{
            console.log(res);
            dispatch(renameMap({
                id: res.id,
                name: res.name
            }));   
        }).catch((err)=>{
            console.log(err);
        });
        resetRenameTextField();
        toggleEditDialog()
    }

    return (
        <Dialog open={open} onClose={toggleEditDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Enter new name for: {mapName}</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth
                    label='New Map Name'
                    onChange={handleRenameTextFieldChange}
                    value={mapRenameField}
                />
            </DialogContent>
            <DialogActions>
                <Button  onClick={toggleEditDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}