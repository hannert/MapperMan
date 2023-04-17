import { Comment, ContentCopy, GroupAdd, Map, Save, Upload, Delete } from '@mui/icons-material';
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
import AuthContext from '../api';
import { renameMap, deleteMap } from '../app/store-actions/editMapList';
import apis from '../app/store-requests/store_requests';





// import PlaylisterToolbar from './PlaylisterToolbar';

function AppBanner() {
    const { auth } = useContext(AuthContext);
    // const { store } = useContext(GlobalStoreContext);
    const map = useSelector((state) => state.editMapList.activeMap);
    const user = useSelector((state) => state.editMapList.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();



    const [anchorEl, setAnchorEl] = useState(null);
    const [mapName, setMapName] = useState("");
    const [mapRenameField, setMapRenameField]=useState("");
    // const [mapFile, setMapFile] = useState({
    //     "type": "FeatureCollection",
    //     "name": "jsontemplate",
    //     "features": [
    //     { "type": "Feature", "properties": { "a1": "", "a2": "", "a3": "", "a4": ""}, "geometry": null }
    //     ]
    // });


    const isMenuOpen = Boolean(anchorEl);


    /** trying to use state for the map name that is displayed on the editing screen */
    useEffect(() => {
        if (map) {
            apis.getMapById(map).then((response) => {
                console.log(response.data.map.mapData);
                console.log(response.data.map.name);
                setMapName(response.data.map.name);
                // setMapFile(response.data.map.mapData);
            }
        )}   
    }, [map])


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

    // Handle click for top right user icon in banner
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        auth.getUserInitials();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handles logout of a logged-in user
    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
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
        let currMapId = map;
        let newName = mapRenameField;
        apis.renameMap(currMapId, newName).then((res)=>{
            if(res.data.success===true){
                console.log("map renamed successfully");
                dispatch(renameMap(res.data.id));
                setMapName(mapRenameField);
            }else{
                console.log("map rename failed");
                console.log(res);
            }
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
        let currMapId = map;
        apis.deleteMapById(currMapId).then((res)=>{
            if(res.data.success===true){
                console.log("map deleted successfully");
                dispatch(deleteMap());
            }else{
                console.log("map delete failed");
                console.log(res);
            }
        });
        navigate("/maps");
        setDeleteDialogOpen(false);
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
    if (user) {
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

    /** TODO: connect this to the auth,make it display the user initials */
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <Face5Icon/>;
    }

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
                            {/* <Face5Icon /> */}
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {saveDialog}
            {copyMapDialog}
            {publishMapDialog}
            {collabDialog}
            {renameDialog}
            {deleteDialog}
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