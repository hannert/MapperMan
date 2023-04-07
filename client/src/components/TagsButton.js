import { Button, Menu, MenuItem } from "@mui/material";
import StyleIcon from '@mui/icons-material/Style';
import React from "react";

export default function TagsButton(){
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
          sx = {{width:'50px', height:'50px', borderRadius:'50%', backgroundColor: '#d2d4d9', margin:'10px', marginTop:'-.125px'}}
        >
          <StyleIcon sx={{color:'black'}}></StyleIcon>
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
          <MenuItem onClick={handleClose}>North America</MenuItem>
          <MenuItem onClick={handleClose}>South America</MenuItem>
          <MenuItem onClick={handleClose}>Europe</MenuItem>
          <MenuItem onClick={handleClose}>Asia</MenuItem>
          <MenuItem onClick={handleClose}>Africa</MenuItem>
          <MenuItem onClick={handleClose}>Australia</MenuItem>
          <MenuItem onClick={handleClose}>Antartica</MenuItem>

        </Menu>
      </div>
    );
}