import { Add, Check } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import * as shp from 'shpjs';
import * as turf from '@turf/turf';
import { useNavigate } from 'react-router-dom';
import apis from '../../../app/store-requests/store_requests';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMap } from '../../../app/store-actions/editMapList';
/**
 * This component is a dialog that allows the user to upload a map to the user repository in either
 * GeoJSON or SHP/DBF format. 
 * @param {*} props onClose: Closes dialog, open: Opens dialog
 * @returns Dialog for uploading a map
 */
export default function AddMapDialog(props){
    const { onClose, selectedValue, open } = props;

    const [shapefile, setShapefile]=useState(null);
    const [dbfFile, setdbfFile]=useState(null);
    const [geoJsonFile, setGeoJsonFile]=useState(null);
    const [active, setActive]=useState('none')

    const dispatch = useDispatch();
    const navigator = useNavigate();
    const user = useSelector((state) => state.editMapList.user);

    const handleClose = () => {
        setShapefile(null);
        setdbfFile(null);
        setGeoJsonFile(null);
        onClose(selectedValue);
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
                var reader = new FileReader();
                reader.onload = function() {
                    setGeoJsonFile(reader.result);
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
        let options = {tolerance: 0.01, highQuality: false};
        let simplified = turf.simplify(combinedGeoJSON, options);

        
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
        
        let options = {tolerance: 0.01, highQuality: false};
        // let simplified = turf.simplify(geoJsonFile, options);
        console.log(geoJsonFile);
        if(user !== null){
            apis.createMap(user, geoJsonFile).then((res) => {
                console.log("map created");
                if(res.data.success===true){
                    console.log("map created successfully");
                    dispatch(createNewMap(res.data.id));
                    navigator(`/maps/edit`);
                }else{
                    console.log("map creation failed");
                    console.log(res);
                }
            }).catch((err) => {
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
                    backgroundColor: '#393C44'
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
                            borderRadius:'10px',
                            backgroundColor: 'red',
                            marginTop: '15px',
                            marginBottom: '15px',
                            margin: '15px'
                        }}
                    >
                        <Typography 
                            sx={{
                                textAlign:'center', 
                                margin:'auto',
                                fontFamily: 'koulen, lato, courier'
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
                                backgroundColor:'gray', 
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
                <Grid item xs={6} sx={{ display:'flex', height:'100%', alignItems:"center", justifyContent:'center'}}>
                    <Box sx ={{width:'100%', height:'100%'}}>
                    <Typography sx={{width:'80%', textAlign:'center', backgroundColor:'gray', margin:'auto'}}>SHP/DBF</Typography>
                        <Box sx={{display:'flex', height:'80%', width:'80%', alignItems:"center", 
                                justifyContent:'center', backgroundColor:'gray', margin:'auto', flexDirection:'column'}}>
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