import { Add, Check } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as turf from '@turf/turf';
import { enqueueSnackbar } from 'notistack';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as shp from 'shpjs';
import { createMapThunk, getMapsDataByAccountThunk, setMapList } from '../../../app/store-actions/editMapList';

/**
 * This component is a dialog that allows the user to upload a map to the user repository in either
 * GeoJSON or SHP/DBF format. 
 * @param {*} props onClose: Closes dialog, open: Opens dialog
 * @returns Dialog for uploading a map
 */
export default function AddMapDialog(props){

    const { onClose, open } = props;
    const [shapefile, setShapefile]=useState(null);
    const [dbfFile, setdbfFile]=useState(null);
    const [geoJsonFile, setGeoJsonFile]=useState(null);
    const [active, setActive]=useState('none')

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.accountAuth.user);

    const handleClose = () => {
        setShapefile(null);
        setdbfFile(null);
        setGeoJsonFile(null);
        onClose();
    };

    /*Handles the button icon for shpfile/DBF upload: */
    const shpButton = (shapefile) ? <Check/> : <Add/>;
    const dbfButton = (dbfFile) ? <Check/> : <Add/>;


    /*Handles the confirm button for the same thing */
    const shpdbfConfirm =(shapefile && dbfFile) ? <Button variant="contained" onClick={handleShpDbfConfirm}>Confirm</Button> : <Button disabled variant="contained">Confirm</Button>


    /*Handles the button icon for geoJSON*/
    const geoJsonButton = (geoJsonFile) ? <Check/> : <Add/>;
    /* Handles the confirm button for the same thing */
    const geoJsonConfirm = (geoJsonFile) ? <Button variant="contained" onClick={handleGeoJsonConfirm}>Confirm</Button> : <Button disabled variant="contained">Confirm</Button>


    
    /*TODO: Check if files are valid before setting them? */
    const handleShapefileChange = (event) =>{
    console.log("changing shp file")
        if(event.target.files){
            setShapefile(event.target.files[0]);
            var reader = new FileReader();
            reader.onload = function() {
            setShapefile(reader.result);
            }
            reader.readAsArrayBuffer(event.target.files[0]);
            setGeoJsonFile(null);
        }
    }
    const handleDBFFileChange = (event) =>{
    console.log("changing dbf file")
    if(event.target.files){
        setdbfFile(event.target.files[0]);

        var reader = new FileReader();
        reader.onload = function() {
            setdbfFile( reader.result);
        }
        reader.readAsArrayBuffer(event.target.files[0])
        setGeoJsonFile(null);
    }
    
    }
    const handleGeoJsonChange = (event) =>{
            if(event.target.files){
                console.log(event.target.files);
                setGeoJsonFile(event.target.files[0]);
                console.log(event.target.files[0]);
                var reader = new FileReader();
                reader.onload = function() {
                    setGeoJsonFile(JSON.parse(reader.result));
                }
                reader.readAsText(event.target.files[0])
                setShapefile(null);
                setdbfFile(null);
            }
    }

    /*Confirm button for Shp/Dbf file, should:
        1. Combine the files into GeoJson
        2. Compress the file (idk if this is necessary)
        3. Send the file to database
        4. Send the user to the edit map page of the map they just uploaded
    */
    function handleShpDbfConfirm(){
        console.log("confirm button for shp");
        let combinedGeoJSON = shp.combine([shp.parseShp(shapefile),shp.parseDbf(dbfFile)]);

        console.log(combinedGeoJSON);
        let options = {tolerance: 0.001, highQuality: true};
        let simplified = turf.simplify(combinedGeoJSON, options);

        if(user !== null){
            dispatch(createMapThunk({owner: user, mapData: simplified})).unwrap().then((res) => {
                console.log("trying to make a map from geojson");
                console.log(res);
                dispatch(getMapsDataByAccountThunk({user: user})).unwrap().then((response) => {
                    console.log("Getting maps")
                    navigate('/maps');
                    dispatch(setMapList(response.maps));
                    onClose();
                    enqueueSnackbar('Map successfully uploaded!', {variant:'success'})
                  }).catch((error) => {
                    enqueueSnackbar('Something went wrong while trying refresh!', {variant:'error'})
                    console.log(error);
                  });
            }).catch((err) => {
                enqueueSnackbar('Something went wrong while trying to upload SPF/DBF!', {variant:'error'})
                console.log(err);
            });
        }

        
    }

    /*Confirm button for GeoJSON file, should:
        1. Compress the file (idk if this is necessary)
        2. Send the file to database
        3. If user is loggedin , add the map to the user's owned maps, as it's ObjectId hashed
        4. Set the editMapList activeMap to the id of the map just uploaded
        5. Send the user to the edit map page
    */
    function handleGeoJsonConfirm(){
        console.log("confirm button for geojson");
        
        let options = {tolerance: 0.001, highQuality: true};
        let simplified = turf.simplify(geoJsonFile, options);

        if(user !== null){
            dispatch(createMapThunk({owner: user, mapData: simplified})).unwrap().then((res) => {
                console.log("trying to make a map from geojson");
                console.log(res);
                dispatch(getMapsDataByAccountThunk({user: user})).unwrap().then((response) => {
                    console.log("Getting maps")
                    navigate('/maps');
                    dispatch(setMapList(response.maps));
                    onClose();
                    enqueueSnackbar('Map successfully uploaded!', {variant:'success'})
                  }).catch((error) => {
                    enqueueSnackbar('Something went wrong while trying refresh!', {variant:'error'})
                    console.log(error);
                  });
            }).catch((err) => {
                enqueueSnackbar('Something went wrong while trying to upload GeoJSON!', {variant:'error'})
                console.log(err);
            });
        }
    }


    

    
    return (
        <Dialog 
            maxWidth='md' 
            fullWidth
            open={open} 
            onClose={handleClose}
            sx={{
                borderRadius: '10px',
            }}
        >
            <DialogTitle 
                sx={{
                    textAlign: 'center',
                    backgroundColor: '#393C44'
                }}
            >
                Upload GeoJSON or SHP/DBF
            </DialogTitle>
            <Grid 
                container 
                columnSpacing={4} 
                sx={{
                    alignItems:"center", 
                    height:'400px', 
                    backgroundColor: '#393C44',
                }}
            >
                <Grid 
                    item 
                    xs={6} 
                    sx={{ display:'flex', height:'100%', alignItems:"center", justifyContent:'center'}}
                >
                    <Box 
                        sx ={{
                            width:'100%', 
                            height:'100%',

                        }}
                    >
                        <Typography 
                            sx={{
                                textAlign:'center', 
                                margin:'auto',
                                width: '80%',
                                fontFamily: 'koulen, lato, courier',
                                backgroundColor: '#2F343D',
                                borderRadius: '5px 5px 0 0'
                            }}
                        >
                            GeoJSON
                        </Typography>
                        <Box 
                            sx={{
                                display:'flex', 
                                height:'80%', 
                                width:'80%', 
                                alignItems:"center", 
                                justifyContent:'center', 
                                backgroundColor:'#4A4A4F', 
                                margin:'auto', 
                                flexDirection:'column'
                            }}
                        >
                            <Button sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#585454', margin:'10px'}}>
                                <label>
                                    <input multiple type="file" style={{ display: 'none' }} onChange={handleGeoJsonChange}/>
                                    {geoJsonButton}
                                </label>
                            </Button>
                            {geoJsonConfirm}
                        </Box>
                    </Box>
                </Grid>
                <Grid 
                    item 
                    xs={6} 
                    sx={{ display:'flex', height:'100%', alignItems:"center", justifyContent:'center'}}>
                    <Box sx ={{width:'100%', height:'100%'}}>
                    <Typography 
                        sx={{
                            textAlign:'center', 
                            margin:'auto',
                            width: '80%',
                            fontFamily: 'koulen, lato, courier',
                            backgroundColor: '#2F343D',
                            borderRadius: '5px 5px 0 0'
                        }}
                        >
                            SHP/DBF
                            </Typography>
                        <Box                             
                            sx={{
                                display:'flex', 
                                height:'80%', 
                                width:'80%', 
                                alignItems:"center", 
                                justifyContent:'center', 
                                backgroundColor:'#4A4A4F', 
                                margin:'auto', 
                                flexDirection:'column'
                            }}>
                            SHP FILE:

                            <Button sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#585454', margin:'10px'}}>
                                <label>
                                    <input multiple type="file" onChange={handleShapefileChange} style={{ display: 'none' }}/>
                                    {/* <Add sx={{color:'black'}}></Add> */}
                                    {shpButton}
                                </label>
                            </Button>
                            DBF FILE:
                            <Button sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#585454', margin:'10px'}}>
                                <label>
                                    <input multiple type="file" onChange={handleDBFFileChange} style={{ display: 'none' }}/>
                                    {dbfButton}
                                </label>
                            </Button>
                            {shpdbfConfirm}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    )
}