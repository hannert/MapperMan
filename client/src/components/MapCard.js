import { ButtonBase, CardActionArea, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Box } from '@mui/material';


export default function MapCard(props) {
    const { map } = props;

    let cardClass = "list-card unselected-list-card";
    const index = map.index;
    return (
        <Box sx = {{'&:hover': {
            opacity: [0.9, 0.8, 0.7],
        }}}>
            <CardActionArea>
            {/* Title with delete */}
            <Box sx={{backgroundColor: '#d2d4d9', color: 'black', display: 'flex', height:'25px'}}>
                {map.map}                 
                <DeleteIcon style={{fontSize:'16pt', color:'white', marginLeft:'auto'}} />
            </Box>  

            {/* Picture of the map here */}
            <Box sx ={{backgroundColor: '#56585c', color: 'white', minHeight: '200px'}}>
                <div>Picture here</div>
            </Box>
            
            {/* User who made map and published here */}
            <Box sx ={{height:'25px', backgroundColor: 'black', color: 'white'}}>
                <Grid container rowSpacing={0}>
                    <Grid item xs = {6} sx={{textAlign:'left'}}>
                            {'By: Bob'}
                    </Grid>
                    <Grid item xs = {6} sx={{textAlign:'right'}}>
                        {'Published: ' + map.published}
                    </Grid>
                </Grid>
            </Box>
            </CardActionArea>
        </Box>
    );
}