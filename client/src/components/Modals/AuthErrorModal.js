import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../api';

// Future location of the confirm fork map dialog component

export default function AuthErrorModal () {
    const {auth} = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("Error Message goes here!")

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

    return (
        <div>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button> */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
}