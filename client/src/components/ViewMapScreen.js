import { Box, Grid } from '@mui/material';
import hash from 'object-hash';
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import CommentsList from "./CommentsList";
import file from './NA.json'; //hardcoded geojson



function ViewMapScreen() {
    /*USE THIS ID TO GET FROM BACKEND:*/
    const { id } = useParams();





    // let leaf = ''
    // const currentMap = 
    // leaf = (
    //     <MapContainer center={[51.505, -0.09]} zoom={1} doubleClickZoom={false}>
    //         <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
    //         <GeoJSON 
    //             key={hash(currentMap)} 
    //             data={(currentMap)} 
    //             />
    //     </MapContainer>
    // )

    return(
        <Grid container direction='row' justify="flex" alignItems="center" justifyContent="center">
            
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center" color="red" bgcolor='#2B2B2B'>
                    VIEWING: Italy
                </Box>
            </Grid>

            <Grid item xs={4}>
                <Box display="flex">
                    <CommentsList />
                </Box>
            </Grid>
            <Grid item  bgcolor='#2B2B2B' component="main" direction="column" justify="flex-end" alignItems="center" xs={8}>
                <Grid item>
                    <Box>
                        <MapContainer center={[51.505, -0.09]} zoom={1} doubleClickZoom={false}
                            id="mapId"
                            preferCanvas={true}>
                                <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                                <GeoJSON 
                                    key={hash(file)} 
                                    data={file} 
                                    />
                        </MapContainer>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
        
    )
}
export default ViewMapScreen;