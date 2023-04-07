import MapCard from './MapCard';
import { Grid, Box, Paper } from '@mui/material';

export default function MapsScreen(){
    const currentList = [
        {map: 'Africa', published: '3/7/2023', index: 0},
        {map: 'South America', published: '3/2/2023', index: 1},
        {map: 'Germany', published: '3/3/2023', index: 2},
        {map: 'Netherlands', published: '2/27/2023', index: 3}
    ]

    
    return (
        <Grid sx={{backgroundColor: '#2B2B2B', marginTop: '20px', display:'flex',alignItems:"center", justifyContent:"center"}}>
                    {/* Added margin top to have a gap like the mockup, idk how to make background universally gray tho */}
            <Box sx={{width: '75%', height: '75%', backgroundColor: '#2B2B2B', marginTop: '20px'}}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {      
                        currentList.map((map)=>(
                            <Grid item xs = {6} sx={{align: 'center'}} >
                                <MapCard key={map} sx = {{height: '400px', backgroundColor: '#282c34'}} map={map}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </Grid>

    )
}