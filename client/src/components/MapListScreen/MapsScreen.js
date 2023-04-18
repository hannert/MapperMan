import MapCard from './MapCardComponents/MapCard';
import FilterMaps from './SearchComponents/FilterMaps';
import AddMapButton from './MapUploadComponents/AddMapButton';
import Pagination from '@mui/material/Pagination';
import { Grid, Box, Paper } from '@mui/material';
import Pages from './SearchComponents/Pages';
import React, { useEffect, useState } from 'react';
import apis from '../../app/store-requests/store_requests';
import { useDispatch, useSelector } from 'react-redux';
import {setMapList} from '../../app/store-actions/editMapList';
import PublishDialog from './MapCardComponents/PublishDialog';

export default function MapsScreen(){
    const [currentList, setCurrentList] = useState([
        {name: 'Africa', published: '3/7/2023', index: 0},
    ])
    const [publishDialogOpen, setPublishDialogOpen] = React.useState(false);

    const handlePublishClick = () => {
        setPublishDialogOpen(true);
    };

    const handlePublishDialogClose = (value) => {
        setPublishDialogOpen(false);
    };

    const dispatch = useDispatch();
    const user = useSelector((state) => state.editMapList.user);
    const maps = useSelector((state) => state.editMapList.mapList);

    useEffect(() => {
        if (user) {
            apis.getMapsDataByAccount(user).then((response) => {
                console.log(response.data.maps);
                dispatch(setMapList(response.data.maps));
                setCurrentList(response.data.maps);
            }
        )}   
    }, [user])

    useEffect(() => {
        if(maps){
            setCurrentList(maps);
        }
    }, [maps]);

    
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
                            <Grid key={map.index} item xs = {6} sx={{align: 'center'}} >
                                <MapCard key={map.index} sx = {{height: '400px', backgroundColor: '#282c34'}} map={map}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            <Grid container sx={{ alignItems:"center", justifyContent:"center", margin:'10px'}}>
                <Pages></Pages>
            </Grid>
            
            <PublishDialog></PublishDialog>
        </Grid>

    )
}