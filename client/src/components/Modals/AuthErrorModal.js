import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';

import { setErrorMessage, setModalActive } from '../../app/store-actions/accountAuth';

export default function AuthErrorModal () {
    const errorMessage = useSelector((state) => state.accountAuth.errorMessage);
    const modalActiveVal = useSelector((state) => state.accountAuth.modalActive);
    const dispatch = useDispatch();
  
    const handleClose = () => {
      dispatch(setErrorMessage(''));
      dispatch(setModalActive(false));
    };

    return (
        <div>
        {/* <Dialog open={modalActiveVal} onClose={handleClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
             <div>{errorMessage}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Confirm</Button>
          </DialogActions>
        </Dialog> */}
      </div>
    )
}