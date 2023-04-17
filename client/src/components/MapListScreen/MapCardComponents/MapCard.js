import { CardActionArea, IconButton, Typography } from '@mui/material';
import React from 'react'
import { Grid, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dummy from '../../na.png';
import MapCardActions from './MapCardActions';

/**
 * This component is a card that displays a map in the Map List Screen. Deals with actions
 * relating to the map, such as deleting, forking, and publishing.
 * @param {*} props Map object from the Database
 * @returns Map Card to display in the Map List Screen
 */
export default function MapCard(props) {
    const navigate = useNavigate();
    const { map } = props;
    const id = "id-belongs-here"

    function handleDelete(e){
        e.stopPropagation();
    }

    function handleMapClick(){
        console.log('Map clicked');
        
        /*routes you to /maps/view/id, where id is the id of the map, which can be
        used to GET the map from the backend. We should set up proper authentication
        when using this, so users cannot just go to a url and access a map that is
        not published or that they dont own */

        navigate(`/maps/view/${id}`)
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
            <Box sx={{backgroundColor: '#d2d4d9', color: 'black', display: 'flex', height:'35px'}}>
                <Grid container rowSpacing={0}>
                    <Grid item xs = {6} sx={{textAlign:'left', fontSize:'24px'}}>
                        <Typography sx = {{margin:'5px', fontSize: 18}}>
                            {map.map}
                        </Typography>
                    </Grid>
                    <Grid item xs = {6} sx={{textAlign:'right'}}>
                        <MapCardActions></MapCardActions>
                    </Grid>
                </Grid>          
            </Box>  
            <CardActionArea>

            {/* Picture of the map here */}
            <Box sx ={{backgroundColor: '#56585c', color: 'white', minHeight: '200px', maxWidth:'100%', maxHeight:'100%'}}>
                <img alt='?' src={dummy} width='100%' height='100%'></img>
            </Box>
            
            {/* User who made map and published here */}
            <Box sx ={{height:'25px', backgroundColor: 'black', color: 'white', marginTop:'-5px'}}>
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