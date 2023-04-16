import { Add } from '@mui/icons-material';
import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";

export default function AddMapButton(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#d2d4d9', margin:'10px   '}}
        >
          <Add sx={{color:'black'}}></Add>
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
            <label>
            <input multiple type="file" style={{ display: 'none' }}/>
            <MenuItem onClick={handleClose}>
              SHP/DBF Upload
            </MenuItem>
            </label>
            
          <MenuItem onClick={handleClose}>GeoJSON Upload</MenuItem>
        </Menu>
      </div>
    );
}