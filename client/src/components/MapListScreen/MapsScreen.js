import MapCard from './MapCardComponents/MapCard';
import FilterMaps from './SearchComponents/FilterMaps';
import AddMapButton from './MapUploadComponents/AddMapButton';
import Pagination from '@mui/material/Pagination';
import { Grid, Box, Paper } from '@mui/material';
import Pages from './SearchComponents/Pages';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PublishDialog from './MapCardComponents/PublishDialog';
import { getMapsDataByAccountThunk } from '../../app/store-actions/editMapList';
import { setMapList } from '../../app/store-actions/editMapList';
import { useNavigate } from 'react-router-dom';
import { getLoggedInThunk, loginUser } from '../../app/store-actions/accountAuth';

export default function MapsScreen(){
    const [currentList, setCurrentList] = useState([
        {name: 'Africa', published: '3/7/2023', index: 0},
    ])
    const [publishDialogOpen, setPublishDialogOpen] = React.useState(false);
    const loggedIn = useSelector((state) => state.accountAuth.loggedIn);

    const togglePublishDialog = () =>{
        setPublishDialogOpen(!publishDialogOpen);
        console.log("clicked on publish button!")
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.accountAuth.user);
    const guest = useSelector((state) => state.accountAuth.guest);
    const maps = useSelector((state) => state.editMapList.mapList);
    useEffect(() => {
        dispatch(getLoggedInThunk()).unwrap().then((response) => {
            dispatch(loginUser(response.user));
        })
    }, [])

    useEffect(() => {
        if (user) {
            dispatch(getMapsDataByAccountThunk({user: user})).unwrap().then((response) => {
                dispatch(setMapList(response.maps));
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [user])

    useEffect(() => {
        if(maps){
            setCurrentList(maps);
        }
    }, [maps]);

    //If user's aren't logged in don't let them see this
    //If the user is not a guest AND not a user, don't let them see this
    if (!loggedIn || (!guest && (user === null))) {
        navigate('/');
    }


    /**Conditional rendering of the publish dialog:  */
    let pubDialog = "";
    pubDialog = (publishDialogOpen) ? <PublishDialog open={true} togglePublishDialog={togglePublishDialog}/> : <PublishDialog open={false} togglePublishDialog={togglePublishDialog}/> ;




    return (
        <Grid container rowSpacing={0} sx={{backgroundColor: '#2B2B2B',
                    alignItems:"center", justifyContent:"center", marginRight: '10px'}}>

            {/* Giving this height is a cursed technique but is what it is */}
            <Grid item  xs = {12} sx={{textAlign:'right', height:'25px'}}>
                <AddMapButton></AddMapButton>
            </Grid>
            <Grid container sx={{ alignItems:"center", justifyContent:"center"}}>
                <FilterMaps></FilterMaps>
            </Grid>

            <Box sx={{width: '70%', backgroundColor: '#2B2B2B', marginTop: '20px'}}>
                <Grid container rowSpacing={6} columnSpacing={6}>
                    {      
                        currentList.map((map)=>(
                            <Grid key={map.id} item xs = {6} sx={{align: 'center'}} >
                                <MapCard key={map.id} sx = {{height: '400px', backgroundColor: '#282c34'}} map={map} togglePublishDialog={togglePublishDialog}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            <Grid container sx={{ alignItems:"center", justifyContent:"center", margin:'10px'}}>
                <Pages></Pages>
            </Grid>
            
            {pubDialog}
        </Grid>

    )
}