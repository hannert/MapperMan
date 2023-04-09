import { Box, TextField, Typography } from "@mui/material";

// import {GlobalStoreContext } rom '../store';

export default function CommentCard(props){
    const { comment } = props;
    return (
        <Box sx= {{backgroundColor: '#FFFFFF', color: 'black', display: 'flex', height:'40px'}}>
            <Typography sx = {{margin:'5px', fontSize: 18}}>
                {comment.comment}
            </Typography>

        </Box>
    )
}

