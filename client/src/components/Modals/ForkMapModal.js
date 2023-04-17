import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../api';
import apis from '../../../app/store-requests/store_requests';
import { useSelector } from 'react-redux';

// Future location of the confirm fork map dialog component

export default function ForkMapModal () {

    const [open, setOpen] = useState(false);
    const [mapName, setMapName] = useState("Error Message goes here!")
    const user = useSelector((state) => state.editMapList.user);

    useEffect(() => {
      setError(auth.errorMessage)
    }, [auth.errorMessage])

    useEffect(() => {
      if(auth.modalActive === true) setOpen(true)
      else setOpen(false)
    }, [auth.modalActive])

    const handleClickOpen = () => {
      setOpen(true);
      console.log(auth)
    };
  
    const handleClose = () => {
      auth.closeModal()
    };

    const handleFork = () => {
      apis.forkMap(id)
    }

    return (
        <div>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button> */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Fork Map?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to fork {mapName} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
}