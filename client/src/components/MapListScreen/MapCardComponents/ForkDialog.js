import { DialogContent, DialogContentText, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { forkMapThunk, getMapsDataByAccountThunk, setMapList } from '../../../app/store-actions/editMapList';

export default function ForkDialog (props) {
    const {open, toggleForkDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.mapCardClickedId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.mapCardClickedName, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);

    const handleConfirm = () => {
      console.log("map Id that will be published: " + mapID)
      dispatch(forkMapThunk({
          id: mapID,
          user: user
      })).catch((error) =>{
          console.log(error);
      }).then(() => {
          dispatch(getMapsDataByAccountThunk({user: user})).unwrap().then((response) => {
            console.log("Getting maps")
            dispatch(setMapList(response.maps));
          }).catch((error) => {
              console.log(error);
          });


      })
      
      
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