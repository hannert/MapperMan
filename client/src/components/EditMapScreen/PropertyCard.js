import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Box } from "@mui/system";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { editMapPropertyThunk } from '../../app/store-actions/leafletEditing';
import { useSelector, useDispatch } from 'react-redux';



export default function PropertyCard(props){
    const {propKey, propType, propValue} = props;
    const [value, setValue] = useState(propValue);
    const [editActive, setEditActive] = useState(false);
    const dispatch = useDispatch();
    const featureIndex = useSelector((state)=>state.leafletEditing.featureClickedIndex);
    const currMapId = useSelector((state)=>state.editMapList.activeMapId);

    const handleValueDoubleClick = (event) =>{
        console.log("clicked on property value");
        event.stopPropagation();
        setEditActive(true);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            dispatch(editMapPropertyThunk({id: currMapId, index: featureIndex, property: propKey, value: value})).unwrap().then((res)=>{
                console.log(res);
            }).catch((err)=>{
                console.log(err);
            });
            setEditActive(false);
        }
    }

    function handleUpdateText(event){
        setValue(event.target.value);
    }



    let propertyValue = (<TableCell onDoubleClick={handleValueDoubleClick} key={propValue}>{value}</TableCell>)

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
            <TableCell key={propKey}>{propKey}</TableCell>
            <TableCell key={propType}>{propType}</TableCell>
            {propertyValue}
        </TableRow>
    )

}