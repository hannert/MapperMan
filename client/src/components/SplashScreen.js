import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Icon } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';



function SplashScreen(){
    return(
        <Box id="splash-screen">
            <Box>
                <img src="https://i.ibb.co/SnCcPnW/Mapper-Man-Logo-Transparent.png" id="mapperman-logo"/>
                <Typography variant='h1' id='logo-text' color={'white'} sx={{fontFamily: 'Koulen'}}>Mapper Man</Typography>
                <Typography color={'white'} sx={{fontFamily: 'Lato'}}>Aiming to provide better map editing. One vertex at a time.</Typography>
                <Box id="splash-screen-buttons">
                    <Button sx={{color:"white", mt:"20px", width:280, height: 80, fontSize: 24, borderRadius: 3, fontWeight: 'bold', justifyContent: 'space-around'}} 
                            variant="contained" 
                            color="buttonColor"
                            component={Link} to="/login"
                    >
                        Log in
                        <LoginIcon sx={{fontSize: 48}}/>
                        
                    </Button>
                    <Button sx={{color:"white", mt:"20px",  width:280, height: 80, fontSize: 24, borderRadius: 3, fontWeight: 'bold', justifyContent: 'space-around'}}
                            variant="contained" 
                            color="buttonColor"
                            component={Link} to="/register"

                    >
                        Create Account
                        <AppRegistrationIcon sx={{fontSize: 48}}/>
                    </Button>
                    <Button sx={{color:"white", mt:"20px",  width:280, height: 80, fontSize: 24, borderRadius: 3, fontWeight: 'bold', justifyContent: 'space-around'}}
                            variant="contained" 
                            color="buttonColor"
                    >
                        Continue as guest
                        <PersonIcon sx={{fontSize: 60}}/>
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
export default SplashScreen;