import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from "@mui/system";
import { useState, useContext  } from 'react';
import TextField from '@mui/material/TextField';
import { editMapPropertyThunk } from '../../app/store-actions/leafletEditing';
import { setCurrentGeoJSON, setFeatureClicked, setPrevGeoJSON, setProperties, emitPropertyChange, editPropertyValue, deleteProperty} from '../../app/store-actions/leafletEditing';
import { useSelector, useDispatch} from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteMapPropertyThunk } from '../../app/store-actions/leafletEditing';
import { SocketContext } from '../../socket';



export default function PropertyCard(props){
    const {propKey, propType, propValue} = props;
    const [value, setValue] = useState(propValue);
    const [editActive, setEditActive] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const featureIndex = useSelector((state)=>state.leafletEditing.featureClickedIndex);
    const currMapId = useSelector((state)=>state.editMapList.activeMapId);
    const socket = useContext(SocketContext);

    const handleValueDoubleClick = (event) =>{
        console.log("clicked on property value");
        event.stopPropagation();
        setEditActive(true);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            dispatch(editMapPropertyThunk({id: currMapId, index: featureIndex, property: propKey, value: value, newProperty: {isNew: false, type: 'none'}})).unwrap().then((res)=>{
                console.log(res);

                /**Emit the change, then do it on the client side */
                
                dispatch(emitPropertyChange({
                    socket: socket,
                    currMapId: currMapId,
                    key: propKey,
                    value: value,
                    type: 'edit'
                }))

                

                dispatch(editPropertyValue({
                    key: propKey,
                    value: value,
                    featureIndex: featureIndex
                }))


            }).catch((err)=>{
                console.log(err);
            });
            setEditActive(false);
        }
    }

    function handleUpdateText(event){
        setValue(event.target.value);
    }

    function handleDeleteButton(event){
        event.stopPropagation();
        setDeleteDialogOpen(true);
    }

    function handleCloseDeletePropertyDialog(){
        setDeleteDialogOpen(false);
    }

    function handleDeletePropertyConfirm(){
        dispatch(deleteMapPropertyThunk({id: currMapId, index: featureIndex, property: propKey})).unwrap().then((res)=>{
            console.log(res);

            /**Basically, emits the edit and then makes the change on the client side
             * 
             * Need to figure out why there is weird behavior when the entry is removed
             */

            dispatch(emitPropertyChange({
                socket: socket,
                currMapId: currMapId,
                key: propKey,
                value: value,
                type: 'delete'
            }))



            dispatch(deleteProperty({
                key: propKey,
                featureIndex: featureIndex
            }))



            handleCloseDeletePropertyDialog();

        }).catch((err)=>{
            console.log(err);
            handleCloseDeletePropertyDialog();
        });
    }

    const deleteDialog = (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeletePropertyDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Delete property?</DialogTitle>
            <DialogActions>
                <Button  variant = 'contained' onClick={handleCloseDeletePropertyDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleDeletePropertyConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )



    let propertyValue = (<TableCell onDoubleClick={handleValueDoubleClick} key={propValue}>{value}</TableCell>);

    let deleteButton =(
        <TableCell>
            <Button onClick={handleDeleteButton}>
                <DeleteIcon/>
            </Button>
        </TableCell>
    )

    if(editActive){
        propertyValue = 
        <TextField
            margin="normal"
            required
            fullWidth
            label=""
            name="name"
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={value}
            inputProps={{style: {fontSize: 12}}}
            InputLabelProps={{style: {fontSize: 12}}}
            autoFocus
        />
    }

    return(

        <TableRow>
            <TableCell >{propKey}</TableCell>
            {/* <TableCell >{propType}</TableCell> */}
            {propertyValue}
            {deleteButton}
            {deleteDialog}
        </TableRow>

    )

}