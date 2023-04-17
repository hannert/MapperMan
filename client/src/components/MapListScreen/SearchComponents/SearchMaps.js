import { Box, Container, Autocomplete, InputAdornment, TextField, Grid } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchMaps(){
    const [input, setInput] = useState("");

    const handleChange = (event) => {
      setInput(event.target.value);
    };
    const currentList = [
        {map: 'Africa', published: '3/7/2023', index: 0},
        {map: 'South America', published: '3/4/2023', index: 1},
        {map: 'Germany', published: '3/3/2023', index: 2},
        {map: 'Netherlands', published: '2/27/2023', index: 3},
        {map: 'France', published: '2/20/2023', index: 4},
        {map: 'New Zealand', published: '2/19/2023', index: 5},
        {map: 'China', published: '2/16/2023', index: 6},
        {map: 'Japan', published: '2/16/2023', index: 7},
        {map: 'United States', published: '2/16/2023', index: 8},
        {map: 'Iceland', published: '2/16/2023', index: 9}
      ]    
    return (
    <Autocomplete
              id="maps-search"
              disableClearable
              forcePopupIcon={false}
              sx = {{width:'600px', marginLeft: '5px'}}
              options={currentList.map((obj) => obj.map)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                    ),
                  }}
                />
              )}
            />
    )
}