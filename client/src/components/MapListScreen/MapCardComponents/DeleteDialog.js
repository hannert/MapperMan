import { DialogContent, DialogContentText, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteMapThunk, getMapsDataByAccountThunk, setMapList } from '../../../app/store-actions/editMapList';
import { enqueueSnackbar } from 'notistack';

export default function DeleteDialog (props) {
    const {open, toggleDeleteDialog } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mapID = useSelector((state) => state.editMapList.mapCardClickedId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.mapCardClickedName, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);

    const handleConfirm = () => {
      console.log("map Id that will be deleted: " + mapID)
      dispatch(deleteMapThunk({
          id: mapID,
          user: user
      })).catch((error) =>{
          console.log(error);
      }).then(() => {
        dispatch(getMapsDataByAccountThunk({user: user})).unwrap().then((response) => {
          console.log("Getting maps")
          dispatch(setMapList(response.maps));
          enqueueSnackbar('Map successfully deleted!', {variant:'success'})
        }).catch((error) => {
          enqueueSnackbar('Something went wrong while trying to delete map.', {variant:'error'})
          console.log(error);
        });
      })
      toggleDeleteDialog();
    }


    return (
      <Dialog open={open} onClose={toggleDeleteDialog} maxWidth='sm'>
        <DialogTitle>Delete Map?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {mapName}?
          </DialogContentText>
          <DialogContentText>
            <Typography variant='caption'>
              This action cannot be undone!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={toggleDeleteDialog}>Cancel</Button>
            <Button variant='contained'onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )
}