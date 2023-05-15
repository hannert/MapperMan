import { DialogContent, DialogContentText, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { forkMapThunk, getMapsDataByAccountThunk } from '../../app/store-actions/editMapList';

export default function ForkModal (props) {
    const {open, toggleForkDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);
    const guest = useSelector((state)=>state.accountAuth.guest);

    const handleConfirm = () => {
      console.log("map Id that will be forked: " + mapID)
      if(!guest){
        dispatch(forkMapThunk({
            id: mapID,
            user: user
        })).catch((error) =>{
            console.log(error);
        }).then(() => {
            dispatch(getMapsDataByAccountThunk({user: user})).unwrap().then((response) => {
              enqueueSnackbar('Map successfully forked!', {variant:'success'})
            }).catch((error) => {
              enqueueSnackbar('Something went wrong while trying to fork map!', {variant:'error', autoHideDuration: 2000})
              console.log(error);
            });
        })
        toggleForkDialog();
      }
      else{
        enqueueSnackbar('Error: Guests cannot fork a map!', {variant: 'error', autoHideDuration: 1000})
        toggleForkDialog();
      }
    }

    const handleCancel = () =>{
      toggleForkDialog();
    }


    return (
      <Dialog open={open} onClose={toggleForkDialog} maxWidth='sm'>
        <DialogTitle>Fork Map?</DialogTitle>
        <DialogContent>
          <DialogContentText> 
            Are you sure you want to fork {mapName}?
          </DialogContentText>
          <Typography variant='caption'>
            This action cannot be undone!
          </Typography>
        </DialogContent>
        
        <DialogActions>
            <Button onClick={handleConfirm}>Cancel</Button>
            <Button variant='contained'onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )
}