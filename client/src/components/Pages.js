import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/system';
import { useEffect } from 'react';

export default function Pages(){

    function handleOnChange(){
        window.scrollTo(0, 0)
    }
    return (
        <Box sx={{backgroundColor:'gray', margin:'10px', borderRadius: '10px'}}>
            <Pagination onChange={handleOnChange} count={10} size="large" />
        </Box>
    )
}