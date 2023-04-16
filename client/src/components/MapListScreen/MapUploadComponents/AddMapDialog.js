import { Button, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Add } from '@mui/icons-material';


export default function AddMapDialog(props){
    const { onClose, selectedValue, open } = props;
    const handleClose = () => {
        onClose(selectedValue);
      };

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
                                <Add sx={{color:'black'}}></Add>
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ display:'flex', height:'100%', alignItems:"center", justifyContent:'center'}}>
                    <Box sx ={{width:'100%', height:'100%'}}>
                    <Typography sx={{width:'80%', textAlign:'center', backgroundColor:'gray', margin:'auto'}}>SHP/DBF</Typography>
                        <Box sx={{display:'flex', height:'80%', width:'80%', alignItems:"center", 
                                justifyContent:'center', backgroundColor:'gray', margin:'auto'}}>
                            <Button sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#585454', margin:'10px'}}>
                                <Add sx={{color:'black'}}></Add>
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    )
}