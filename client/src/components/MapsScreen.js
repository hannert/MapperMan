//deprecated, go to the file in components/maplistscreen
//delete this at some point 



// import MapCard from './MapCard';
// import FilterMaps from './FilterMaps';
// import AddMapButton from './AddMapButton';
// import Pagination from '@mui/material/Pagination';
// import { Grid, Box, Paper } from '@mui/material';
// import Pages from './Pages';

// export default function MapsScreen(){
//     const currentList = [
//         {map: 'Africa', published: '3/7/2023', index: 0},
//         {map: 'South America', published: '3/4/2023', index: 1},
//         {map: 'Germany', published: '3/3/2023', index: 2},
//         {map: 'Netherlands', published: '2/27/2023', index: 3},
//         {map: 'France', published: '2/20/2023', index: 4},
//         {map: 'New Zealand', published: '2/19/2023', index: 5},
//         {map: 'China', published: '2/16/2023', index: 6},
//         {map: 'Japan', published: '2/16/2023', index: 7},
//         {map: 'United States', published: '2/16/2023', index: 8},
//         {map: 'Iceland', published: '2/16/2023', index: 9}
//     ]

    
//     return (
//         <Grid container rowSpacing={0} sx={{backgroundColor: '#2B2B2B',
//                     alignItems:"center", justifyContent:"center", marginRight: '10px'}}>

//             {/* Giving this height is a cursed technique but is what it is */}
//             <Grid item  xs = {12} sx={{textAlign:'right', height:'25px'}}>
//                 <AddMapButton></AddMapButton>
//             </Grid>
//             <Grid container xs = {12} sx={{ alignItems:"center", justifyContent:"center"}}>
//                 <FilterMaps></FilterMaps>
//             </Grid>

//             <Box sx={{width: '70%', backgroundColor: '#2B2B2B', marginTop: '20px'}}>
//                 <Grid container rowSpacing={6} columnSpacing={6}>
//                     {      
//                         currentList.map((map)=>(
//                             <Grid item xs = {6} sx={{align: 'center'}} >
//                                 <MapCard key={map} sx = {{height: '400px', backgroundColor: '#282c34'}} map={map}/>
//                             </Grid>
//                         ))
//                     }
//                 </Grid>
//             </Box>
//             <Grid container xs = {12} sx={{ alignItems:"center", justifyContent:"center", margin:'10px'}}>
//                 <Pages></Pages>
//             </Grid>
//         </Grid>

//     )
// }