import { Box, TextField, Typography } from "@mui/material";
import { Grid, Button } from '@mui/material';

export default function CommentsList(){
    const currentList = [
        {comment: "Woah, Cool!", index: 0},
        {comment: "Meh, mid", index: 1},
        {comment: "STOPPPP", index: 2},
        {comment: "EWWW WHAT IS THIS MAP LOL", index: 3}
    ]
    return(
        <Box sx={{
            height:'92.5%', 
            backgroundColor:'#D4D4F5', 
            display:'flex', 
            flexDirection:'column',
            borderRadius: 2
            }}>
            <Typography variant="overline">Comments</Typography>
            <Box id='comment-container' sx={{height:'87.5%'}}>
            </Box>
            <Box sx={{p:1}}>
                
                <TextField
                label="Add Comment"
                >

                </TextField>
            </Box>

        </Box>
    )
}
