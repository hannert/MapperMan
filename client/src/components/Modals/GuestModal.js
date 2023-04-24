import { DialogContent, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

export default function GuestModal (props) {
    const {open, toggleGuestModal } = props;
    const navigate = useNavigate();


    const handleConfirm = () => {
      toggleGuestModal();
    }


    return (
      <Dialog open={open} onClose={toggleGuestModal} maxWidth='sm'>
        <DialogTitle>Unauthorized</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You must be logged in to do that!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant='contained'onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )
}