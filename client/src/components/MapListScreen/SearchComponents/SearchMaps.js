import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getPublicMapsByNameThunk, setMapList } from '../../../app/store-actions/editMapList';

export default function SearchMaps(){

    const dispatch = useDispatch();

    const [input, setInput] = useState("");

    const handleChange = (event) => {
      setInput(event.target.value);
    };

    const handleSubmit = (event) => {
      if(event.key === 'Enter'){

        dispatch(getPublicMapsByNameThunk({
          name: input
        })).then((response) => {
          console.log("Getting maps with name ", input)
          console.log('Maps', response.payload?.maps)

          if(response.payload){
            if(response.payload?.maps.length === 0) {
              enqueueSnackbar('No maps found with that name!', {variant:'warning'})
            } 
            else {
              dispatch(setMapList(response.payload.maps));
              enqueueSnackbar('Maps successfully retreived!', {variant:'success'})
            }
          } 
          if(!response.payload){
            enqueueSnackbar('Please input a search critera.', {variant:'info'})
          }
          
          
        }).catch((error) => {
          enqueueSnackbar('Something went wrong while trying to fetch public maps.', {variant:'error'})
          console.log(error);
        });
      }
    }

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
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleSubmit}
                />
              )}
            />
    )
}