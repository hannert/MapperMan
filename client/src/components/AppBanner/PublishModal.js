import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { publishMapThunk } from "../../app/store-actions/editMapList";
import { useNavigate } from 'react-router-dom';
export default function PublishModal(props){
    const { open, togglePublishDialog } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);

    const handleConfirm = () =>{
        console.log("map Id that will be published: " + mapID)
        dispatch(publishMapThunk({
            id: mapID
        })).catch((error) =>{
            console.log(error);
        })
        togglePublishDialog();
        navigate("/maps")
    }

    return (
        // <div></div>
        <Dialog open={open} onClose={togglePublishDialog} maxWidth='sm'>
            <DialogTitle>
                Publish Map?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to publish {mapName}?
                </DialogContentText>
                <Typography variant='caption'>
                    This action cannot be undone!
                </Typography>
            </DialogContent>
            
            <DialogActions> 
                <Button onClick={togglePublishDialog}>Cancel</Button>
                <Button variant='contained'onClick={handleConfirm}>Confirm</Button>
            </DialogActions>

        </Dialog>
    )
}