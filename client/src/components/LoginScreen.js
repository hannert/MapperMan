import AuthContext from '../api'


import { useContext, useState } from 'react'
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { loginUser } from '../app/store-actions/editMapList';
import apis from '../api/auth-request-api';
import { useNavigate } from 'react-router-dom';
import AuthErrorModal from './Modals/AuthErrorModal';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: 200,
        width: 400,
        border: '5px solid yellow',
        fontSize: "20px",
        p: 4
    };
    let modalJSX = "";
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const handleCloseButton = () => {
        modalJSX = "";
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        auth.loginUser(email, password);
    }
    

    return (
        <Grid container  component="main" direction="column" justify="flex-end" alignItems="center" >
            <CssBaseline />
            <AuthErrorModal/>
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
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Link href="/forgotPassword/" variant="body2" id="forgot-password-link">
                            Forgot Password? Click here
                        </Link>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            id="sign-in-button"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/register/" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
            {  modalJSX  }
        </Grid>
    );
}