import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
function SplashScreen(){

    return(
        <div id="splash-screen">
            <img src="https://i.ibb.co/SnCcPnW/Mapper-Man-Logo-Transparent.png" id="mapperman-logo"/>
            Aiming to provide better map editing. One vertex at a time.
            <div id="splash-screen-buttons">
                <Button sx={{color:"white", mt:"20px", width:180, fontSize: 13, fontWeight: 'bold'}}variant="contained" component={Link} to="/login">Log in</Button>
                <Button sx={{color:"white", mt:"20px",  width:180, fontSize: 13, fontWeight: 'bold'}}variant="contained" component={Link} to="/register">Create Account</Button>
                <Button sx={{color:"white", mt:"20px",  width:180, fontSize: 13, fontWeight: 'bold'}}variant="contained" >Continue as guest</Button>
            </div>

        </div>
    )


}
export default SplashScreen;