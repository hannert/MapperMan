import { Button, FormControl, IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Box } from "@mui/system";
import { AddCircle, AddLocation, Circle, Merge, Mouse, Redo, RemoveCircle, Timeline, Undo, WrongLocation } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentGeoJSON, setFeatureClicked, setPrevGeoJSON, setProperties, updateProperties, addProperty, emitPropertyChange} from '../../app/store-actions/leafletEditing';
import PropertyCard from './PropertyCard';
import { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { editMapPropertyThunk } from '../../app/store-actions/leafletEditing';
import { SocketContext } from '../../socket';
import { enqueueSnackbar } from 'notistack';







export default function PropertyEditor(props){
    const {handleToggleProperty} = props;
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);


    /**
     * deprecated, not really any need for the featureClicked State
     */
    // const feature = useSelector((state)=>state.leafletEditing.featureClicked);
    const featureIndex = useSelector((state)=>state.leafletEditing.featureClickedIndex);
    const currMapId = useSelector((state)=>state.editMapList.activeMapId);
    const geoJSON = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const [addNewPropertyMenuOpen, setAddNewPropertyMenuOpen] = useState(false);
    const [newNameText, setNewNameText] = useState("");
    const [newType, setNewType] = useState('string');
    const [newValue, setNewValue] = useState("");

    const properties = useSelector((state)=>state.leafletEditing.properties);
    /**
     * Holds the properties in the feature that was taken
     * from the state
     */
    const featureProperties = properties[featureIndex];


    /**
     * Puts the properties into the
     * rows that can be seen by the user
     * Another approach is to create a custom properties section of the
     * GeoJSON file once it is uploaded, haven't looked into if thats
     * even possible
     */
    const rows = []


    for (var key in featureProperties){
        rows.push(<PropertyCard propKey={key} propType={typeof(key)} propValue={featureProperties[key]} />)
    }

    const handleAddPropertyClick = (event)=>{
        setAddNewPropertyMenuOpen(!addNewPropertyMenuOpen);
    }

    const handleUpdateNameText = (event) =>{
        setNewNameText(event.target.value);
    }

    const handleUpdateType = (event) =>{
        setNewType(event.target.value);
        
    }

    const handleUpdateValueText = (event) =>{
        setNewValue(event.target.value) 
    }

    const resetFields = () =>{
        setNewValue('');
        setNewNameText('');
        setNewType('string');
    }

    function handleConfirm(event) {
        console.log("confirm");
        if(newNameText!=='' && newValue!==''){
            dispatch(editMapPropertyThunk({id: currMapId, index: featureIndex, property: newNameText, value: newValue, newProperty: {isNew: true, type: newType}})).unwrap().then((res)=>{
                console.log(res);


                dispatch(emitPropertyChange({
                    socket: socket,
                    currMapId: currMapId,
                    key: newNameText,
                    value: newValue,
                    type: 'add'
                }))

                dispatch(addProperty({
                    key: newNameText,
                    value: newValue,
                    featureIndex: featureIndex
                }))


                resetFields();
                setAddNewPropertyMenuOpen(false);

            }).catch((err)=>{
                console.log(err);
                resetFields();
                setAddNewPropertyMenuOpen(false);
            });
        }
        
    }

    function handleCancel(){
        resetFields();
        setAddNewPropertyMenuOpen(false);
    }

    let newPropertyField = ''
    if(addNewPropertyMenuOpen){
        newPropertyField = 
        <TableRow>
            <TableCell>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    name="Name"
                    onChange={handleUpdateNameText}
                    defaultValue={newNameText}
                    inputProps={{style: {fontSize: 12}}}
                    InputLabelProps={{style: {fontSize: 12}}}
                    autoFocus
                />
            </TableCell>
                
            <TableCell>
                <FormControl>
                <Select
                    id="prop-type-select"
                    value = {newType ? newType : ""}
                    // label = "Type"
                    onChange={handleUpdateType}
                    style={{fontSize: "12px"}}
                >

                <MenuItem value={"string"}>
                    String
                </MenuItem>

                <MenuItem value={"number"}>
                    Number
                </MenuItem>
                
                </Select>
                </FormControl>
            </TableCell>
                
            <TableCell>
                <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Value"
                        name="Name"
                        onChange={handleUpdateValueText}
                        defaultValue={newValue}
                        inputProps={{style: {fontSize: 12}}}
                        InputLabelProps={{style: {fontSize: 12}}}
                        autoFocus
                />
            </TableCell>

            <TableCell>
                <Button variant='contained' fullWidth onClick={handleConfirm}>
                    Confirm
                </Button>
                <Button variant='contained' fullWidth onClick={handleCancel} color='error' sx={{mt:'2px'}}>
                    Cancel
                </Button>
            </TableCell>
        </TableRow>
    }


    



    return(
        <Box id='property-editor' sx={{width:'35%', height:'100%', backgroundColor:'#1D2026', display:'flex',  flexDirection:'column', alignItems:'flex-start'}}>
            <IconButton onClick={handleToggleProperty} >
                <ChevronLeftIcon />
            </IconButton>
            <Typography variant='h4' sx={{fontFamily:'Koulen', color:"#B9D3E9", marginLeft:'20px'}}>
                Edit Region Properties
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                    Type
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                    Value
                                </Typography>
                            </TableCell>
                            <TableCell>
                                
                            </TableCell>
                        </TableRow>
                    </TableHead> 
                    <TableBody>
                        {
                            rows
                        }
                        {
                            newPropertyField
                        }
                        <TableRow >
                            <TableCell colSpan={3}>
                                <Box sx={{display:'flex', justifyContent:'center'}}>
                                    <Button>
                                        <AddCircle onClick={handleAddPropertyClick}/>
                                    </Button>    
                                </Box>                        
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}