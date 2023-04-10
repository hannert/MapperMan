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
        <Box sx={{height:"100%"}}>
            <Box width='100%' color="white" bgcolor='#2B2B2B' sx={{textAlign:'center'}}>
                        VIEWING: Italy
                    </Box>
            <Grid container direction='row'sx={{height:'100%'}}>

                <Grid item xs={4}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CommentsList />
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
                                    key={hash(file)} 
                                    data={file} 
                                    />
                        </MapContainer>
                    </Box>
                </Grid>
            </Grid>
                                
        </Box>
        
    )
}
export default ViewMapScreen;