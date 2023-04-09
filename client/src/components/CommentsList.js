import { Box, TextField, Typography } from "@mui/material";
import { Grid, Button } from '@mui/material';
import CommentCard from './CommentCard';


export default function CommentsList(){
    const currentList = [
        {comment: "Woah, Cool!", index: 0},
        {comment: "Meh, mid", index: 1},
        {comment: "STOPPPP", index: 2},
        {comment: "EWWW WHAT IS THIS MAP LOL", index: 3},
        {comment: "Hode up... kinda cool >_<", index: 4}
    ]
    return(
        <Box sx={{
            backgroundColor:'#D4D4F5', 
            }}>
            <Typography variant="overline">Comments</Typography>
            <Box id='comment-container' sx={{height:'87.5%'}}>
                <Box sx={{p:1}}>
                    <Grid container rowSpacing={6} columnSpacing={6}>
                            {      
                            currentList.map((comment)=>(
                                <Grid item xs = {12} sx={{align: 'center'}} >
                                    <CommentCard key={comment} sx = {{height: '400px', backgroundColor: '#282c34'}} comment={comment}/>
                                </Grid>
                            ))
                        }
                    </Grid>
                    <TextField
                    label="Add Comment"
                    >

                    </TextField>
                </Box>
            </Box>
            

        </Box>
    )
}
