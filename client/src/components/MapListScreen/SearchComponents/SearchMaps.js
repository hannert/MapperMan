import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { setMapList,setFilteredList, getPublicMapsThunk, getMapsDataByAccountThunk, getUserSharedMapsThunk } from '../../../app/store-actions/editMapList';
import { useResolvedPath } from "react-router-dom";

import ClearIcon from '@mui/icons-material/Clear';
export default function SearchMaps(props){
    const currentList = useSelector((state) => state.editMapList.mapList)
    const filteredList = useSelector((state) => state.editMapList.filteredList)
    const dispatch = useDispatch();
    const guest = useSelector((state) => state.accountAuth.guest);
    const user = useSelector((state) => state.accountAuth.user);
    const repoType = useSelector((state) => state.editMapList.repo);
    const [input, setInput] = useState("");
    const handleChange = (event) => {
      setInput(event.target.value);
    };
    let searchResults = []
    
    const handleResetView = (event) => {
      dispatch(setFilteredList([]))
      dispatch(setMapList(currentList))
    }
    const handleSubmit = (event) => {
      const temp = currentList
      if(event.key === 'Enter'){
        if(guest || repoType == "public"){
          console.log(temp.length)
          let query = input.toLowerCase();
          if (query.length == 0){
            enqueueSnackbar('Please input a search criteria.', {variant: 'failure'})
          }
          else{
            for (let i = 0; i <temp.length; i++){
              if (temp[i].name.toLowerCase().includes(query)){
                searchResults.push(temp[i])
              }
            }
            if (searchResults.length != 0){
              console.log(searchResults)
              dispatch(setFilteredList(searchResults));
              enqueueSnackbar('Maps successfully retrieved!', {variant: 'success'})
            }
            else{
              enqueueSnackbar('No maps found with that name!', {variant: 'warning'})
            }
          }

        }
        else if (repoType == "owned"){
          let query = input.toLowerCase();
          if (query.length == 0){
            enqueueSnackbar('Please input a search criteria.', {variant: 'failure'})
          }
          else{
            for (let i = 0; i < temp.length; i++){
              if (temp[i].name.toLowerCase().includes(query)){
                searchResults.push(temp[i])
              }
            }
            if (searchResults.length != 0){
              dispatch(setFilteredList(searchResults));
              enqueueSnackbar('Maps successfully retrieved!', {variant: 'success'})
            }
            else{
              enqueueSnackbar('No maps found with that name!', {variant: 'warning'})
            }
          }
        }
        else if (repoType == "shared"){
          let query = input.toLowerCase();
          if (query.length == 0){
            enqueueSnackbar('Please input a search criteria.', {variant: 'failure'})
          }
          else{
            for (let i = 0; i < temp.length; i++){
              if (temp[i].name.toLowerCase().includes(query)){
                searchResults.push(temp[i])
              }
            }
            if (searchResults.length != 0){
              dispatch(setFilteredList(searchResults));
              enqueueSnackbar('Maps successfully retrieved!', {variant: 'success'})
            }
            else{
              enqueueSnackbar('No maps found with that name!', {variant: 'warning'})
            }
          }
        }
      }
    }
      
    return (
              <Box>
                <TextField
                  label="Search input"
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleSubmit}
                />
                {filteredList.length != 0 && <Button onClick={handleResetView} sx={{color: "white"}}><ClearIcon/></Button>}
              </Box>

    )
}