import { IconButton } from '@mui/material';
import React, { useContext, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

export default function MapCard(props) {
    const { map } = props;

    let cardClass = "list-card unselected-list-card";
    const index = map.index;
    return (
        <Box sx ={{             
            '&:hover': {
                opacity: [0.9, 0.8, 0.7],
              }}}>
            {/* Title with delete */}
            <Box sx={{backgroundColor: '#d2d4d9', margin: '10px', marginBottom: '-10px', color: 'black', display: 'flex', height:'35px'}}>
                {map.map}                 
                <DeleteIcon style={{fontSize:'16pt', color:'white', marginLeft:'auto'}} />
            </Box>  

            {/* Picture of the map here */}
            <Box sx ={{backgroundColor: '#56585c', margin: '10px', marginTop: '-10px', color: 'white', minHeight: '200px'}}>
                <div>Picture here</div>
            </Box>
            
            <Box sx ={{height:'25px', backgroundColor: 'black', color: 'white', margin: '10px', marginTop:'-10px'}}>
                <div sx={{textAlign:'right'}}>
                {map.published}
                </div>
            </Box>
        </Box>
    );
}