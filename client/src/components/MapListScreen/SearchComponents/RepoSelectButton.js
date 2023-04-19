import { Button, Menu, MenuItem } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setMapList, setPublicRepo } from "../../../app/store-actions/editMapList";

import { getMapsDataByAccountThunk, getPublicMapsThunk } from "../../../app/store-actions/editMapList";

export default function RepoSelectButton(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const user = useSelector((state) => state.accountAuth.user);

    const dispatch = useDispatch();
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLoadUserMaps = () => {
        console.log('load user maps');
        if (user) {
          dispatch(getMapsDataByAccountThunk({user: user})).then((response) => {
              console.log("Get maps response")
              console.log(response);
              if(response.payload.success){
                  dispatch(setMapList(response.payload.maps));
              }
          });
        }   
    }

    const handleLoadPublicMaps = () => {
        console.log('load public maps');
        if (user) {
          dispatch(getPublicMapsThunk()).then((response) => {
              console.log("Get maps response")
              console.log(response);
              if(response.payload.success){
                  dispatch(setMapList(response.payload.maps));
              }
          });
        }   
    }

    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#d2d4d9', margin:'10px', marginTop:'-.125px'}}
        >
          <FolderIcon sx={{color:'black'}}></FolderIcon>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleLoadUserMaps}>Your Maps</MenuItem>
          <MenuItem onClick={handleLoadPublicMaps}>Public Maps</MenuItem>
        </Menu>
      </div>
    );
}