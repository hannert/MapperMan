import AuthContext from '../api'
import { useContext } from 'react';
// import MUIErrorModal from './MUIErrorModal'


import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.loginUser(
            formData.get('email'),
            formData.get('password')
        );

    };

    // let modalJSX = "";
    // console.log(auth);
    // if (auth.errorMessage !== null){
    //     modalJSX = <MUIErrorModal />;
    // }
    // console.log(modalJSX);

    return (
        <Grid container  component="main" direction="column" justify="flex-end" alignItems="center" >
            <CssBaseline />
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
            {/* { modalJSX } */}
        </Grid>
    );
}