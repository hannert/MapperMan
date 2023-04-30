import { Face5 } from '@mui/icons-material';
import { Alert, Snackbar, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import store from '../app/store';
import { logout, logoutThunk } from '../app/store-actions/accountAuth';
import { clear } from '../app/store-actions/editMapList';
import { saveGeojsonThunk } from '../app/store-actions/leafletEditing';
import EditMapActions from './AppBanner/EditMapActions';
import ViewMapActions from './AppBanner/ViewMapActions';

// import PlaylisterToolbar from './PlaylisterToolbar';

function AppBanner() {

    const mapName = useSelector((state) => state.editMapList.activeMapName);
    const loggedIn = useSelector((state) => state.accountAuth.loggedIn);
    const user = useSelector((state) => state.accountAuth.user);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
  
    const [anchorEl, setAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);


    // ! - State for dialogs

    const [saveOpen, setSaveOpen] = useState(false);
    const handleSaveOpen = () => {
        setSaveOpen(true);
    }

    const handleSaveClose = (event, reason) => {
        if (reason === 'clickaway') {
            return; 
        }

        setSaveOpen(false);    
    }


    // ! ------------------ End of State for dialogs

    // User initials for account icon
    // Guests will not have an account icon
    const [userInitials, setUserInitials] = useState('');
    useEffect(() => {
        if (loggedIn && user) {
            let user = store.getState().accountAuth.user;
            setUserInitials(user.firstName.charAt(0) + user.lastName.charAt(0));
        }
    }, [loggedIn, user]);

    // Handle click for top right user icon in banner
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        // auth.getUserInitials();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Send request to backend to invalidate jwt
    // Then, dispatch logout action to update state
    // Finally, navigate to login page
    const handleLogout = () => {
        handleMenuClose();
        dispatch(logoutThunk()).unwrap().then((response) => {
            console.log(response)
            dispatch(logout());
            dispatch(clear());
            navigate('/');
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleToLogin = () => {
        handleMenuClose();
        navigate('/login/')
    }

    const handleToCreate = () => {
        handleMenuClose();
        navigate('/register/')
    }

    // ! Areas for placeholder functions as Store is not implemented yet, 
    // ! Have components bunched up in AppBanner: Modals for Copy, Delete, Add Collaborator

    const saveDialog = (
        <Snackbar
            open={saveOpen}
            autoHideDuration={2000}
            onClose={handleSaveClose}
        >
            <Alert onClose={handleSaveClose} severity='success' sx={{width:'100%'}}>
                Successfully saved map!
            </Alert>

        </Snackbar>
    )

    // ! ------------- End for placeholder modals


    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            sx = {{
                fontFamily: 'Koulen, Roboto'
            }}
        >
            <MenuItem onClick={handleToLogin}>
                <Typography>
                    Login
                </Typography>
            </MenuItem>
            <MenuItem onClick={handleToCreate}>
                <Typography>
                    Create New Account
                </Typography>
            </MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>
                <Typography>
                    Logout
                </Typography>
            </MenuItem>
        </Menu>        

    let menu = loggedOutMenu;
    if (loggedIn) {
        menu = loggedInMenu;
    }

    // Figure out the current path the user is on
    // Display buttons / Map name conditionally
    let screen = location.pathname;
    let buttonGroup = '';
    let actionText='';

    // If we are on MapEditScreen
    if(screen === '/maps/edit') {
        actionText = (
            <Typography sx={{fontFamily:'Roboto mono'}}>
                Now Editing: {mapName}
            </Typography>
        )
        buttonGroup = (
            <EditMapActions />
        )
    }
    // If we are on MapViewScreen
    if(screen.startsWith('/maps/view/') === true) {
        buttonGroup = (
            <ViewMapActions />
        );
        actionText = (
            <Typography sx={{fontFamily:'Roboto mono'}}>
                Now viewing {mapName}
            </Typography>
        )
    }

    let accountCircle = ""

    if (loggedIn === true) {
       accountCircle = 
            <Box sx={{ height: "50px", display: { xs: 'none', md: 'flex' }}}>
                <Tooltip title='You are currently logged in as a user'>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Typography>
                            {userInitials}
                        </Typography>
                    </IconButton>                    
                </Tooltip>

            </Box>
    } else if (loggedIn === false){
        accountCircle = (
            <Box sx={{ height: "50px", display: { xs: 'none', md: 'flex' }}}>
                <Tooltip title='You are currently a guest.'>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Face5 />
                    </IconButton>                    
                </Tooltip>
            </Box>
        )
    }
    return (
        <Box sx={{color:'black', width:'100%'}}>
            {console.log(process.env.REACT_APP_AUTH_URL)}
            <AppBar position="static" sx={{bgcolor: "#252931",}}>
                <Toolbar>
                    <Link style={{ textDecoration: 'none', color: 'white',  }} to='/'>
                        <Typography                        
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' }, fontFamily: 'Koulen', '&:hover':{color:'#F47378', transition:'all 0.3s ease'}}}                        
                        >
                            Mapper Man
                        </Typography>                        
                        {/* <img src="https://i.ibb.co/SnCcPnW/Mapper-Man-Logo-Transparent.png" height={35} width={35}/> */}
                    </Link>
                    <Box sx={{ flexGrow: 1, textAlign:'center'}}>
                        {actionText}
                    </Box>
                    <Box sx={{backgroundColor:'#2C2E34'}}>
                        {buttonGroup}
                    </Box>
                    {accountCircle}
                    
                </Toolbar>
            </AppBar>

            {saveDialog}
            {menu}

        </Box>
    );
}
export default AppBanner;