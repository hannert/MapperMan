import { Dialog, DialogTitle, Button, DialogActions } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { publishMapThunk } from "../../../app/store-actions/editMapList";

export default function PublishDialog(props){
    const { onClose, selectedValue, open, togglePublishDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.mapCardClickedId, shallowEqual);



    // const handleClose = () => {
    //     onClose(selectedValue);
    // };

    const handleConfirm = () =>{
        console.log("map Id that will be published: " + mapID)
        dispatch(publishMapThunk({
            id: mapID
        })).catch((error) =>{
            console.log(error);
        })
        togglePublishDialog();
    }

    return (
        // <div></div>
        <Dialog
        maxWidth='sm' 
        fullWidth
        open={open} 
        onClose={togglePublishDialog}
    >
        <DialogTitle 
            sx={{
                textAlign: 'center',
                backgroundColor: '#393C44'
            }}
        >
            Publish Map?
        </DialogTitle>

        <DialogActions sx={{
                textAlign: 'center',
                backgroundColor: '#393C44',
                justifyContent: 'center'
            }}> 
                <Button  onClick={togglePublishDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleConfirm}>Confirm</Button>
        </DialogActions>

        </Dialog>
    )
}