import { Button, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import { Add, Check } from '@mui/icons-material';


export default function AddMapDialog(props){
    const { onClose, selectedValue, open } = props;

    const [shapefile, setShapefile]=useState(null);
    const [dbfFile, setdbfFile]=useState(null);

    const handleClose = () => {
        onClose(selectedValue);
    };



    const shpButton = (shapefile) ? <Check/> : <Add/>;
    const dbfButton = (dbfFile) ? <Check/> : <Add/>;


    
    /*TODO: Check if files are valid before setting them? */
    const handleShapefileChange = (event) =>{
    console.log("changing shp file")
        if(event.target.files){
            setShapefile(event.target.files[0]);
            var reader = new FileReader();
            reader.onload = function() {
            setShapefile(reader.result);
            }
            reader.readAsArrayBuffer(event.target.files[0])
        }
    }
    const handleDBFFileChange = (event) =>{
    console.log("changing dbf file")
    if(event.target.files){
        setdbfFile(event.target.files[0]);

        var reader = new FileReader();
            reader.onload = function() {
            setdbfFile(reader.result);
            }
            reader.readAsArrayBuffer(event.target.files[0])
    }
}

    return (
        <Dialog maxWidth='lg' open={open} onClose={handleClose}>
            <DialogTitle sx={{textAlign: 'center'}}>Upload GeoJSON or SHP/DBF</DialogTitle>
            <Grid container columnSpacing={4} sx={{alignItems:"center", height:'300px', width:'500px'}}>
                <Grid item xs={6} sx={{ display:'flex', height:'100%', alignItems:"center", justifyContent:'center'}}>
                    <Box sx ={{width:'100%', height:'100%'}}>
                        <Typography sx={{width:'80%', textAlign:'center', backgroundColor:'gray', margin:'auto'}}>GeoJSON</Typography>
                        <Box sx={{display:'flex', height:'80%', width:'80%', alignItems:"center", 
                                justifyContent:'center', backgroundColor:'gray', margin:'auto'}}>
                            <Button sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#585454', margin:'10px'}}>
                                <label>
                                    <input multiple type="file" style={{ display: 'none' }}/>
                                    <Add sx={{color:'black'}}></Add>
                                </label>
                            </Button>
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
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    )
}