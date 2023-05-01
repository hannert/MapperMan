import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { updateCollaboratorThunk } from '../../app/store-actions/leafletEditing';
import { isValidEmail } from '../../app/store-requests/store_requests';

export default function CollaboratorModal(props){
    const { open, toggleCollaboratorDialog } = props;
    const dispatch = useDispatch();
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);
    const sharedWith = useSelector((state) => state.leafletEditing.sharedWith);
    const user = useSelector((state) => state.accountAuth.user);

    const [input, setInput] = useState('');
    const [localCollab, setLocalCollab] = useState([]);
    const [errorText, setErrorText] = useState('');

    const re = /^\S+@\S+\.\S+$/;

    useEffect(() => {
        console.log(sharedWith)
        setLocalCollab(sharedWith)
    }, [sharedWith])

    // Handles the textField text
    function handleChange(event) {
        setInput(event.target.value);
    }

    // Handles the enter key input to add people
    async function handleAdd(event) {
        if(event.key === 'Enter'){
            // Not a valid email if test is false
            if(re.test(input) === false){
                setErrorText('Enter a valid email.')
                setInput('')
                return
            }
            if(user.email === input){
                setErrorText('You are the owner!')
                setInput('')
                return
            }
            await isValidEmail(input).then((response) => {
                if(response.status === 200){
                    let copy = [...localCollab] // Copy the array
                    copy.push(input)
                    setLocalCollab(copy)
                    setInput('')
                    setErrorText('')
                }
                if(response.status === 204){
                    setErrorText('Not a user.')
                    setInput('')
                    return
                }
            }).catch((error) => {
                setErrorText('Enter a valid email.')
                setInput('')
                return
            })
            // let copy = [...localCollab] // Copy the array
            // copy.push(input)
            // setLocalCollab(copy)
            // setInput('')
            // setErrorText('')
        }
    }

    function handleConfirm() {
        console.log("Confirm collab")
        dispatch(updateCollaboratorThunk({
            id: mapID,
            user: user,
            collaborators: localCollab
        })

        )
        toggleCollaboratorDialog()


    }
    
    function deleteItem(index) {
        let copy = [...localCollab]
        copy.splice(index, 1);
        setLocalCollab(copy);
    }

    return (
        <Dialog open={open} onClose={toggleCollaboratorDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Share {mapName} ?</DialogTitle>
            <DialogContent>
                {
                    (errorText !== '') ? 
                    <TextField
                        error
                        helperText={errorText}
                        fullWidth
                        label='Add people'
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleAdd}
                    />
                    :
                    <TextField 
                        fullWidth
                        label='Add people'
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleAdd}
                    />
                }
                
            </DialogContent>
            <DialogContent>
                <Typography variant='h6'> People with access </Typography>
                <Box display='flex' gap='10px' flexDirection='column'>
                    {
                    localCollab?.map((user, index) => (
                        <Box sx={{backgroundColor:'#121316', borderRadius:'1rem', padding:'4px', display:'flex', justifyContent:'space-between' }}>
                            <Typography sx={{alignItems:'center'}}>
                                {user}
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
                <Button  onClick={toggleCollaboratorDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
      </Dialog>
    )
}