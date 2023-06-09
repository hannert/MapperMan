import { useContext } from 'react';
// import MUIErrorModal from './MUIErrorModal'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import LockResetIcon from '@mui/icons-material/LockReset';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthErrorModal from './Modals/AuthErrorModal';

import { forgotPasswordThunk, setModalActive, setErrorMessage } from '../app/store-actions/accountAuth';

export default function AfterVerifyScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const url = window.location.href
        console.log(url)
        const userId = url.split("/")[4]
        console.log(userId)
        const formData = new FormData(event.currentTarget);
        const password = formData.get('new-password')
        const passwordVerify = formData.get('confirm-newpassword')
        console.log(password + " " + passwordVerify)
        dispatch(forgotPasswordThunk({password: password, passwordVerify: passwordVerify, userId: userId})).unwrap().then((response) => {
            console.log("password changed")
            navigate("/login")
        }).catch((error) => {
            console.log(error)
            dispatch(setErrorMessage(error))
            dispatch(setModalActive(true))
        });
    };

    return (
        <Grid container  component="main" direction="column" justify="flex-end" alignItems="center" >
            <CssBaseline />
            <AuthErrorModal />
            <Grid item>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockResetIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="new-password"
                            label="New Password"
                            type="password"
                            id="new-password"
                            autoComplete="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-newpassword"
                            label="Confirm New Password"
                            type="password"
                            id="confirm-newpassword"
                            autoComplete="confirm-new-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            id="confirm-change-password-button"
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}