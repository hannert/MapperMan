import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getMapsDataByAccountThunk, publishMapThunk, setMapList } from "../../../app/store-actions/editMapList";

export default function PublishDialog(props){
    const { open, togglePublishDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.mapCardClickedId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.mapCardClickedName, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);

    const handleConfirm = () =>{
        console.log("map Id that will be published: " + mapID)
        dispatch(publishMapThunk({
            id: mapID
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
        togglePublishDialog();
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