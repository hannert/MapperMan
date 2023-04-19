import { Comment, ContentCopy, Delete, ForkRight, GroupAdd, Map, Save, Upload } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Face5Icon from '@mui/icons-material/Face5';
import { Alert, Avatar, Button, Snackbar, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clear, deleteMap, forkMapThunk, renameMap } from '../app/store-actions/editMapList';

import store from '../app/store';
import { logout, logoutThunk } from '../app/store-actions/accountAuth';
import { renameMapThunk, deleteMapThunk } from '../app/store-actions/editMapList';

// import PlaylisterToolbar from './PlaylisterToolbar';

function AppBanner() {

    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const mapName = useSelector((state) => state.editMapList.activeMapName);
    const loggedIn = useSelector((state) => state.accountAuth.loggedIn);
    const user = useSelector((state) => state.accountAuth.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();


    const [anchorEl, setAnchorEl] = useState(null);
    const [mapRenameField, setMapRenameField]=useState("");


    const isMenuOpen = Boolean(anchorEl);


    // ! - State for dialogs
    const [copyMap, setCopyMap] = useState(false);
    const handleCopyOpen = () => {
        setCopyMap(true);
    }
    const handleCopyClose = () => {
        setCopyMap(false);
    }

    const [publishMap, setPublishMap] = useState(false);
    const handlePublishOpen = () => {
        setPublishMap(true);
    }
    const handlePublishClose = () => {
        setPublishMap(false);
    }

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

    const [collabOpen, setCollabOpen] = useState(false);
    const handleCollabOpen = () => {
        setCollabOpen(true);
    }
    const handleCollabClose = () => {
        setCollabOpen(false);
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
            navigate('/login');
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleHouseClick = () => {
        // store.closeCurrentList();

    }

    const handleToLogin = () => {
        handleMenuClose();
        navigate('/login/')
    }

    const handleToCreate = () => {
        handleMenuClose();
        navigate('/register/')
    }

    const [mapRenameOpen, setMapRenameOpen] = useState(false);
    const resetRenameTextField = () =>{
        setMapRenameField("");
    }

    const handleMapRenameOpen = () =>{
        setMapRenameOpen(true);
    }
    const handleMapRenameClose = () =>{
        resetRenameTextField();
        setMapRenameOpen(false);
    }

    const handleRenameSubmit = () =>{
        dispatch(renameMapThunk({id: mapId, newName: mapRenameField})).unwrap().then((res)=>{
            console.log(res);
            dispatch(renameMap({
                id: res.id,
                name: res.name
            }));   
        }).catch((err)=>{
            console.log(err);
        });
        resetRenameTextField();
        setMapRenameOpen(false);
    }
    const handleRenameTextFieldChange = (event) =>{
        setMapRenameField(event.target.value);
    }
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleOpenDeleteMapDialog = () =>{
        setDeleteDialogOpen(true);
    }
    const handleCloseDeleteMapDialog = () =>{
        setDeleteDialogOpen(false)
    }

    const handleDeleteMapConfirm = () =>{
        // Dispatch delete thunk, call it with .then(), based off response
        // dispatch deleteMap action if success, else do nothing
        dispatch(deleteMapThunk({
            id: mapId,
            user: user
        })).unwrap().then((res)=>{
            dispatch(deleteMap());
        }).catch((error) =>{
            console.log(error);
        })

        navigate("/maps");
        setDeleteDialogOpen(false);
    }


    const [forkDialogOpen, setForkDialogOpen] = useState(false);
    const handleOpenForkMapDialog = () =>{
        setForkDialogOpen(true);
    }
    const handleCloseForkMapDialog = () =>{
        setForkDialogOpen(false)
    }

    const handleForkMapConfirm = () =>{
        // Dispatch fork thunk, call it with .then(), based off response
        // dispatch forkMap action if success, else do nothing
        dispatch(forkMapThunk({id: mapId, user: user})).unwrap().then((res)=>{
            console.log(res);
            console.log("map forked");
        }).catch(error =>{
            console.log(error);
        });
        navigate("/maps");
        setForkDialogOpen(false);
    }

    


    // ! Areas for placeholder functions as Store is not implemented yet, 
    // ! Have components bunched up in AppBanner: Modals for Copy, Delete, Add Collaborator

    const copyMapDialog = (
        <Dialog open={copyMap} onClose={handleCopyClose}>
        <DialogTitle>Fork Map</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want copy Italy by Alex119098?
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyClose}>Cancel</Button>
          <Button onClick={handleCopyClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )

    const publishMapDialog = (
        <Dialog open={publishMap} onClose={handlePublishClose}>
        <DialogTitle>Fork Map</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want fork Italy by Alex119098?
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handlePublishClose}>Cancel</Button>
          <Button onClick={handlePublishClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )


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

    const collabDialog = (
        <Dialog open={collabOpen} onClose={handleCollabClose} fullWidth maxWidth='sm'>
        <DialogTitle>Share "Italy"</DialogTitle>
        <DialogContent>

          <TextField 
            fullWidth
            label='Add people'
          />
          
          


        </DialogContent>
        <DialogContent>
            <Typography variant='h6'> People with access </Typography>
            <Box display='flex' gap='10px'>
                <Avatar></Avatar>
                <Avatar></Avatar>
                <Avatar></Avatar>
                <Avatar></Avatar>
                <Avatar></Avatar>
                <Avatar></Avatar>
            </Box>
            

        </DialogContent>
        <DialogActions>
          <Button  onClick={handleCollabClose}>Cancel</Button>
          <Button  variant='contained'onClick={handleCollabClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    )

    const renameDialog = (
        <Dialog open={mapRenameOpen} onClose={handleMapRenameClose} fullWidth maxWidth='sm'>
            <DialogTitle>Enter new name for: {mapName}</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth
                    label='New Map Name'
                    onChange={handleRenameTextFieldChange}
                    value={mapRenameField}
                />
            </DialogContent>
            <DialogActions>
                <Button  onClick={handleMapRenameClose}>Cancel</Button>
                <Button  variant='contained'onClick={handleRenameSubmit}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )

    const deleteDialog = (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteMapDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Delete {mapName}?</DialogTitle>
            <DialogActions>
                <Button  onClick={handleCloseDeleteMapDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleDeleteMapConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )


    const forkDialog = (
        <Dialog open={forkDialogOpen} onClose={handleCloseForkMapDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Fork {mapName}?</DialogTitle>
            <DialogActions>
                <Button  onClick={handleCloseForkMapDialog}>Cancel</Button>
                <Button  variant='contained'onClick={handleForkMapConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
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
                <Typography variant='h6'>
                    Login
                </Typography>
            </MenuItem>
            <MenuItem onClick={handleToCreate}>
                <Typography variant='h6'>
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let playListerToolbar = "";
    let menu = loggedOutMenu;
    if (loggedIn) {
        menu = loggedInMenu;
    }

    // /** Gets the current map name from the store */
    // const getCurrentMapName = () => {
    //     // if(map){
    //     //     apis.getMapById(map).then((response) => {
    //     //         console.log(response.data.map.name);
    //     //         return response.data.map.name;
    //     //     }
    //     // )}
    //     return "unknown"
    // }

    // Since we dont have auth set up, this will always return account circle




    let screen = location.pathname;
    let tempToolbar = '';
    let nowEditingText='';
    if(screen === '/maps/edit') {
        tempToolbar = (
            <Box>
                <IconButton>
                    <Save onClick={handleSaveOpen}/>
                </IconButton>
                <IconButton>
                    <GroupAdd onClick={handleCollabOpen}/>
                </IconButton>
                <IconButton>
                    <Upload onClick={handlePublishOpen}/>
                </IconButton>
            </Box>
        )
        
        nowEditingText = (
            <Box>
            <Typography>
                Now Editing: {mapName}
                <IconButton>
                    <EditIcon onClick={handleMapRenameOpen}/>
                </IconButton>
                <IconButton>
                    <Delete onClick={handleOpenDeleteMapDialog}/>
                </IconButton>
                <IconButton>
                    <ForkRight onClick={handleOpenForkMapDialog}/>
                </IconButton>
            </Typography>
            
            </Box>
        )

    }
    if(screen.startsWith('/maps/view/') === true) {
        tempToolbar = (
            <Box>
                <IconButton>
                    <Comment />
                </IconButton>
                <IconButton>
                    <ContentCopy onClick={handleCopyOpen}/>
                </IconButton>
            </Box>
        )
    }

    let accountCircle = <div></div>

    if (loggedIn) {
       accountCircle = <Box sx={{ height: "50px", display: { xs: 'none', md: 'flex' } }}>
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                {/* <Face5Icon /> */}
                { <div>{userInitials}</div> }
            </IconButton>
        </Box>
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
                    <Link to='/maps'>
                        <Map />
                    </Link>
                    <Box sx={{ flexGrow: 1, ml: 50}}>
                    {nowEditingText}
                    </Box>
                    
                    {tempToolbar}
                    {accountCircle}
                    
                </Toolbar>
            </AppBar>
            {saveDialog}
            {copyMapDialog}
            {publishMapDialog}
            {collabDialog}
            {renameDialog}
            {deleteDialog}
            {forkDialog}
            <Snackbar>

            </Snackbar>
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