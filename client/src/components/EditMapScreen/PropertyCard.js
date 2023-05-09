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
import { setCurrentGeoJSON, setFeatureClicked, setPrevGeoJSON, setProperties} from '../../app/store-actions/leafletEditing';
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

                let featureCopy = structuredClone(geoJSON.features[featureIndex]);
                featureCopy.properties[propKey]=value;

                console.log(featureCopy.properties)
                let geoJSONCopy = structuredClone(geoJSON);
                console.log(geoJSONCopy.features[0])
                geoJSONCopy.features[featureIndex] = featureCopy;


                let jsondiffpatch = require('jsondiffpatch').create();
                let delta = jsondiffpatch.diff(geoJSON, geoJSONCopy);
                console.log(socket.emit('edit geoJSON', currMapId, delta))



                console.log("setting the current geojson")
                dispatch(setCurrentGeoJSON(geoJSONCopy));
                
                let properties = [];
                let index=0;
                //**Im just gonna copy this from leaflet container for now, we should really abstract this or something */
                for(let feature of geoJSONCopy.features){
                    properties.push(geoJSONCopy.features[index].properties);
                    index += 1;
                }
                dispatch(setProperties(properties))


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
            let featureCopy = structuredClone(geoJSON.features[featureIndex]);
            delete featureCopy.properties[propKey];
            console.log(featureCopy.properties);
            let geoJSONCopy = structuredClone(geoJSON);
            geoJSONCopy.features[featureIndex] = featureCopy;
            console.log("geoJSON copy: ", geoJSONCopy)
            console.log("setting the current geojson")
            dispatch(setCurrentGeoJSON(geoJSONCopy));
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
                <Button  onClick={handleCloseDeletePropertyDialog}>Cancel</Button>
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
            <TableCell >{propType}</TableCell>
            {propertyValue}
            {deleteButton}
            {deleteDialog}
        </TableRow>

    )

}