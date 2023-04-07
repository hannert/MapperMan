import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/system';
export default function Pages(){

    return (
        <Box sx={{backgroundColor:'gray', margin:'10px', borderRadius: '10px'}}>
            <Pagination count={10} size="large" />
        </Box>
    )
}