import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { updateTagsThunk } from '../../app/store-actions/editMapList';


export default function CollaboratorModal(props){
    const { open, toggleTagDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const currentTags = useSelector((state) => state.editMapList.tags)
    const [localTags, setLocalTags] = useState([])
    const [input, setInput] = useState('');
    const [errorText, setErrorText] = useState('');

    const re = /^\S+@\S+\.\S+$/;

    useEffect(() => {
        setLocalTags(currentTags)
    }, [currentTags])
    // Handles the textField text
    function handleChange(event) {
        setInput(event.target.value);
    }

    // Handles the enter key input to add people
    async function handleAdd(event) {
        if(event.key === 'Enter'){
            // Not a valid email if test is false
           if (input.trim().length === 0){
            setErrorText('Please enter a tag.')
            setInput('')
            return
           }
           let copy = []
           if (localTags?.length === 0){
            copy = []
           }
           else{
            for (var i = 0; i < localTags?.length; i++){
                copy.push(localTags[i])
            }
           }
           copy.push(input)
           setLocalTags(copy)
           setInput('')
           setErrorText('')
            // let copy = [...localCollab] // Copy the array
            // copy.push(input)
            // setLocalCollab(copy)
            // setInput('')
            // setErrorText('')
        }
    }

    function handleConfirm() {
        console.log("Confirm tag")
        console.log("Map id " + mapID)
        if (localTags?.length === currentTags?.length){
            enqueueSnackbar("No new tags added!", {variant:'success', autoHideDuration:1000})
            toggleTagDialog();
        }
        else{
            dispatch(updateTagsThunk({id: mapID, tags: localTags}))
            toggleTagDialog();
            if (localTags?.length < currentTags?.length){   
                enqueueSnackbar('Successfully updated tags!', {variant:'success', autoHideDuration:1000})
            }
            else{
                enqueueSnackbar('Successfully added tags!', {variant:'success', autoHideDuration:1000})
            }
        }



    }
    
    function deleteItem(index) {
        let copy = [...localTags]
        copy.splice(index, 1);
        setLocalTags(copy);
    }

    return (
        <Dialog open={open} onClose={toggleTagDialog} fullWidth maxWidth='sm'>
            <DialogTitle> Add tags </DialogTitle>
            <DialogContent>
                {
                    (errorText !== '') ? 
                    <TextField
                        error
                        helperText={errorText}
                        fullWidth
                        label='Add tag'
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleAdd}
                    />
                    :
                    <TextField 
                        fullWidth
                        label='Add tag'
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleAdd}
                    />
                }
                
            </DialogContent>
            <DialogContent>
                <Typography variant='h6'> Tags </Typography>
                <Box display='flex' gap='10px' flexDirection='column'>
                    {
                    localTags?.map((tag, index) => (
                        <Box sx={{backgroundColor:'#121316', borderRadius:'1rem', padding:'4px', display:'flex', justifyContent:'space-between' }}>
                            <Typography sx={{alignItems:'center'}}>
                                {tag}
                            </Typography>
                                
                            
                            <IconButton onClick={() => {deleteItem(index)}}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ))
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button  onClick={toggleTagDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
      </Dialog>
    )
}