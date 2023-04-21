import { Box, CardActionArea, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dummy from '../../na.png';
import MapCardActions from './MapCardActions';

import { setActiveMap, setMapCardClicked } from '../../../app/store-actions/editMapList';
import { useDispatch } from 'react-redux';

/**
 * This component is a card that displays a map in the Map List Screen. Deals with actions
 * relating to the map, such as deleting, forking, and publishing.
 * @param {*} props Map object from the Database 
 * and Callback function referring to toggling/untoggling the publish dialog
 * @returns Map Card to display in the Map List Screen
 */

export default function MapCard(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { map, togglePublishDialog} = props;

    function handleMapClick(){
        console.log('Map clicked');
        
        /*routes you to /maps/view/id, where id is the id of the map, which can be
        used to GET the map from the backend. We should set up proper authentication
        when using this, so users cannot just go to a url and access a map that is
        not published or that they dont own */
        // navigate(`/maps/view/${id}`)
        if(!map.published){
            dispatch(setActiveMap({
                id: map.id,
                name: map.name
            }));
            navigate('/maps/edit');
        }
        else if(map.published){
            dispatch(setActiveMap({
                id: map.id,
                name: map.name
            }));
            navigate(`/maps/view/${map.id}`);
        }
    }

    function mouseDown(e){
        e.stopPropagation ();
    }

    /**
     * This function sets the 'mapCardClickedId" value in the store to the id of the card that was clicked in
     * any of these actions. 
    */
    function handleActionClick(){
        dispatch(setMapCardClicked({
            id:map.id
        }))
    }


    let date = 'N/A'
    if(map.published){
        let dateObj = new Date(map.createdAt);
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        date = year + "/" + month + "/" + day;
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
                            {map.name}
                        </Typography>
                    </Grid>
                    <Grid item xs = {6} sx={{textAlign:'right'}}>
                        <MapCardActions published={map.published} togglePublishDialog={togglePublishDialog} handleActionClick={handleActionClick}></MapCardActions>
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
                            {'By: ' + map.owner}
                        </Typography>
                    </Grid>
                    <Grid item xs = {6} sx={{textAlign:'right'}}>
                        <Typography sx = {{margin: '3px', fontSize: 14}}>
                            {'Published: ' + date}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            </CardActionArea>
        </Box>
    );
}