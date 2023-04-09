import { useState } from 'react';
import { Link } from 'react-router-dom';
// import AuthContext from '../auth';
import { AccountCircle } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import PlaylisterToolbar from './PlaylisterToolbar';

function AppBanner() {
    // const { auth } = useContext(AuthContext);
    // const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        // auth.logoutUser();
    }

    const handleHouseClick = () => {
        // store.closeCurrentList();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let playListerToolbar = "";
    let menu = loggedOutMenu;
    // if (auth.loggedIn) {
    //     menu = loggedInMenu;
    //     playListerToolbar = <PlaylisterToolbar />;

    // }



    //Since we dont have auth set up, this will always return account circle
    function getAccountMenu(loggedIn) {
        // let userInitials = auth.getUserInitials();
        // console.log("userInitials: " + userInitials);
        // if (loggedIn) 
        //     return <div>{userInitials}</div>;
        // else
            return <AccountCircle />;
    }

    return (
        <Box sx={{color:'black', width:'100%'}}>
            <AppBar position="static" sx={{bgcolor: "#252931",}}>
                <Toolbar>
                    <Link onClick={handleHouseClick} style={{ textDecoration: 'none', color: 'white',  }} to='/'>
                        <Typography                        
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' }, fontFamily: 'Koulen'}}                        
                        >
                            Mapper Man
                        </Typography>                        
                        {/* <img src="https://i.ibb.co/SnCcPnW/Mapper-Man-Logo-Transparent.png" height={35} width={35}/> */}
                    </Link>
                    <Link to='/maps/edit'>
                        <EditIcon />
                    </Link>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ height: "50px", display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {/* { getAccountMenu(auth.loggedIn) } */}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
            {
                playListerToolbar
            }

        </Box>
    );
}
export default AppBanner;