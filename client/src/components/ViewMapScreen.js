import { Box, Button, Grid } from '@mui/material';
import hash from 'object-hash';
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { getMapByIdThunk, setActiveMap } from '../app/store-actions/editMapList';


import { socket } from '../socket';

function ViewMapScreen() {
    /*USE THIS ID TO GET FROM BACKEND:*/
    let username = (Math.random() + 1).toString(36).substring(7);

    const { id } = useParams();
    const dispatch= useDispatch();
    const [mapFile, setMapFile] = useState({
        "type": "FeatureCollection",
        "name": "jsontemplate",
        "features": [
        { "type": "Feature", "properties": { "a1": "", "a2": "", "a3": "", "a4": ""}, "geometry": null }
        ]
    });
    const mapName = useSelector((state) => state.editMapList.activeMapName);

    let unpublished = false;
    /**
     * We should check if the user has permission to view this map (ie if its published or not)
     */
    useEffect(() => {
        if (id) {
            dispatch(getMapByIdThunk({id: id})).unwrap().then((response) => {
                // console.log("Got map by id");
                if(response.map.published){
                    // console.log(response.map);
                    setMapFile(response.map.mapData);
                    dispatch(setActiveMap({name:response.map.name, id:response.map._id}))
                }
                else{
                    unpublished = true;
                }
            }).catch((error) => {
                console.log(error);
            });
        }   
    }, [id])


    function connect() {
        
        console.log("Connecting ", username)
        socket.auth = { username }
        socket.connect();
    }
    function disconnect() {
        console.log("Disconnecting")
        socket.disconnect();
    }

    socket.on('connected', (connected) => {
    })

    

    return(
        <Box sx={{height:"100%"}}>
            <Grid container direction='row'sx={{height:'100%'}}>
                <Button onClick={connect}> Connect </Button>
                <Button onClick={disconnect}> Disconnect </Button>
                <Grid item xs={4}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        {/* <CommentsList /> */}
                    </Box>
                </Grid>
                <Grid item bgcolor='#2B2B2B' component="main" direction="column" justify="flex-end" alignItems="center" xs={8}>
                    <Box sx={{height:'100%'}}>
                        <MapContainer center={[37.09, -95.71]} zoom={4} doubleClickZoom={false}
                            id="mapId"
                            preferCanvas={true}
                            style={{width:'100%', height:'100%'}}
                            
                            >
                                <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                                <GeoJSON 
                                    key={hash(mapFile)} 
                                    data={mapFile} 
                                    />
                        </MapContainer>
                    </Box>
                </Grid>
            </Grid>
                                
        </Box>
        
    )
}
export default ViewMapScreen;