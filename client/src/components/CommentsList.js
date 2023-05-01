import { Box, Grid, TextField, Typography } from "@mui/material";
import CommentCard from './CommentCard';
import { getMapByIdThunk, addCommentThunk } from '../app/store-actions/editMapList';
import { useState, useEffect } from "react";

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
export default function CommentsList(){
    const dispatch = useDispatch();
    const [currentList, setCurrentList] = useState([]);
    const url = window.location.href
    const mapId = url.split("/")[5]
    console.log(mapId)
    

    useEffect(()=>{
        dispatch(getMapByIdThunk({id: mapId})).unwrap().then((response) => {
            setCurrentList(response.map.comments);
            console.log(currentList.length)
        });
    }, [])

    const guest = useSelector((state) => state.accountAuth.guest);
    const user = useSelector((state) => state.accountAuth.user);
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(mapId)
        const formData = new FormData(event.currentTarget);
        const c = formData.get('add-comment')
        console.log(c)
        const username = user.username
        dispatch(addCommentThunk({id: mapId, comment: c, username: username})).unwrap().then((response) => {
            console.log("adding comment");
            dispatch(getMapByIdThunk({id: mapId})).unwrap().then((response) => {
                setCurrentList(response.map.comments);
                console.log(currentList.length)
            });
        }).catch((error) => {
            console.log("not able to")
        });
    }

    // const styles = {
    //     floatingLabelFocusStyle: {
    //         color: "b;acl"
    //     }
    // }

    return(
        <Box sx={{
            backgroundColor:'#D4D4F5', 
            height:'100%'
            }}>
            <Typography variant="overline">Comments</Typography>
            <Box id='comment-container' component="form" onSubmit={handleSubmit} sx={{height:'87.5%'}}>
                <Box sx={{p:1}}>
                    <Grid container rowSpacing={1} columnSpacing={6}>
                            {      
                            currentList.map((comment)=>(
                                <Grid item xs = {12} sx={{align: 'center'}} >
                                    <CommentCard  sx = {{height: '400px', backgroundColor: '#282c34'}} content={comment.content} owner={comment.owner}/>
                                </Grid>
                            ))
                        }
                    </Grid>
                    {!guest && <TextField
                    fullWidth
                    label="Add Comment"
                    margin="normal"
                    focused
                    id="add-comment"
                    name="add-comment"
                    sx={{background: "rgb(255, 255, 255)", input:{color: 'black'}}}
                    >

                    </TextField>}
                </Box>
            </Box>
            

        </Box>
    )
}
