import { Add } from '@mui/icons-material';
import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import AddMapDialog from './AddMapDialog';
import { useSelector } from 'react-redux';
/**
 * Adds a map for the user repository, defaulting the privacy to private. 
 * Calls store functions to add the map to the database and the user's repository.
 * @returns Add Map Button for Map List Screen
 */
export default function AddMapButton(){

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [dialogOpen, setOpen] = React.useState(false);
    const guest = useSelector((state) => state.accountAuth.guest);

    const open = Boolean(anchorEl);

    const handleClick = () => {
      setOpen(true);
    };

    const handleDialogClose = (value) => {
      setOpen(false);
    };
  
    return (
      <div>
        { !guest &&
          <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#d2d4d9', margin:'10px'}}
          >
            <Add sx={{color:'black'}}></Add>
          </Button>

          <AddMapDialog open={dialogOpen} onClose={handleDialogClose} />
        </div>}
        
      </div>
    );
}