import { Button, Menu, MenuItem, TextField, Autocomplete, InputAdornment, Box } from "@mui/material";
import StyleIcon from '@mui/icons-material/Style';
import React, {useState} from "react";
import Chip from '@mui/material/Chip';

export default function TagsFilter(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [input, setInput] = useState("");

    const handleChange = (event) => {
      setInput(event.target.value);
    };
    const currentList = ['North America', 'Asia', 'Antarctica', 'Africa', 'South America', 'Europe', 'Australia' ]    
    return (
      <Box>
      <Autocomplete
              id="tags-search"
              disableClearable
              multiple
              forcePopupIcon={false}
              sx = {{width:'300px', marginLeft: '5px'}}
              options={currentList.map((cont) => cont)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: (
                      <InputAdornment position="end">
                      <StyleIcon />
                      </InputAdornment>
                  ),
                  }}
                />
              )}
            />
      </Box>
    );
    
}