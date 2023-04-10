import { useContext } from 'react';
// import AuthContext from '../auth'
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

export default function LoginScreen() {
    // const { auth } = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // auth.changePassword(email, new password, new password confirm);

    };

    // let modalJSX = "";
    // console.log(auth);
    // if (auth.errorMessage !== null){
    //     modalJSX = <MUIErrorModal />;
    // }
    // console.log(modalJSX);

    return (
        <Grid container  bgcolor='#2B2B2B' component="main" direction="column" justify="flex-end" alignItems="center" >
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
                        <LockResetIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Change Password
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Verify Email
                        </Button>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newpassword"
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
                            id="confirm-new-password"
                            autoComplete="confirm-new-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Grid>
            {/* { modalJSX } */}
        </Grid>
    );
}