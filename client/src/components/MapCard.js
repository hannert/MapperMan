import { CardActionArea, IconButton, Typography } from '@mui/material';
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Box, Button } from '@mui/material';


export default function MapCard(props) {
    const { map } = props;

    function handleDelete(e){
        e.stopPropagation();
    }

    function handleMapClick(){
        console.log('Map clicked');
    }

    function mouseDown(e){
        e.stopPropagation ();
    }



    return (
        <Box sx = {{'&:hover': {
            opacity: [0.9, 0.8, 0.7],
        }}}
            onClick={handleMapClick}>
            {/* Title with delete */}
            <CardActionArea>
            <Box sx={{backgroundColor: '#d2d4d9', color: 'black', display: 'flex', height:'35px'}}>
                <Grid container rowSpacing={0}>
                    <Grid item xs = {6} sx={{textAlign:'left', fontSize:'24px'}}>
                        <Typography sx = {{margin:'5px', fontSize: 18}}>
                            {map.map}
                        </Typography>
                    </Grid>
                    <Grid item xs = {6} sx={{textAlign:'right'}}>
                        <Button container onClick={handleDelete} onMouseDown={mouseDown} sx={{width:'5px', justifyContent: 'center'}}>
                            <DeleteIcon style={{fontSize:'16pt', color:'gray', marginLeft:'auto'}} />
                        </Button>  
                    </Grid>
                </Grid>          
            </Box>  
            {/* Picture of the map here */}
            <Box sx ={{backgroundColor: '#56585c', color: 'white', minHeight: '200px'}}>
                <div>Picture here</div>
            </Box>
            
            {/* User who made map and published here */}
            <Box sx ={{height:'25px', backgroundColor: 'black', color: 'white'}}>
                <Grid container rowSpacing={0}>
                    <Grid item xs = {6} sx={{textAlign:'left'}}>
                        <Typography sx = {{margin: '3px',fontSize: 14}}>
                            {'By: Bob'}
                        </Typography>
                    </Grid>
                    <Grid item xs = {6} sx={{textAlign:'right'}}>
                        <Typography sx = {{margin: '3px', fontSize: 14}}>
                            {'Published: ' + map.published}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            </CardActionArea>
        </Box>
    );
}