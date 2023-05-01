import { Box, TextField, Typography } from "@mui/material";

// import {GlobalStoreContext } rom '../store';

export default function CommentCard(props){
    const { content, owner } = props;
    return (
        <Box sx= {{backgroundColor: '#FFFFFF', color: 'black', display: 'flex'}}>
            <Typography color="blue" fontSize={12}>
                {owner}
            </Typography>
            <Typography sx = {{margin:'5px', fontSize: 18}}>
                {content}
            </Typography>

        </Box>
    )
}

