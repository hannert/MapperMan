import { Button, Menu, MenuItem, TextField, Autocomplete, InputAdornment, Box } from "@mui/material";
import StyleIcon from '@mui/icons-material/Style';
import React, {useState} from "react";
import { enqueueSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from "react-redux";
import { setMapList,setFilteredList, getPublicMapsThunk, getMapsDataByAccountThunk, getUserSharedMapsThunk } from '../../../app/store-actions/editMapList';
export default function TagsFilter(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const currentList = useSelector((state) => state.editMapList.mapList)
    const filteredList = useSelector((state) => state.editMapList.filteredList)
    const repoType = useSelector((state) => state.editMapList.repo);
    const user = useSelector((state) => state.accountAuth.user);
    const handleChange = (event) => {
      setInput(event.target.value);
    };
    let searchResults = []
    const handleResetView = (event) => {
      dispatch(setFilteredList([]))
      dispatch(setMapList(currentList))
      setInput('')
    }
    const handleSubmit = (event) => {
      const temp = currentList
      if(event.key === 'Enter'){
        if(!user || repoType === "public"){
          let query = input.toLowerCase();
          if (query.length === 0){
            enqueueSnackbar('Please input a search criteria.', {variant: 'failure'})
          }
          else{
            for (let i = 0; i < temp.length; i++){
              let tempTags = temp[i].tags
              for (let j = 0; j < tempTags?.length; j++){
                if (tempTags[j].toLowerCase().includes(query)){
                  searchResults.push(temp[i])
                }
              }
            }
            if (searchResults.length !== 0){
              console.log(searchResults)
              dispatch(setFilteredList(searchResults));
              enqueueSnackbar('Map(s) successfully retrieved!', {variant: 'success'})
            }
            else{
              enqueueSnackbar('No maps found with that tag!', {variant: 'warning'})
            }
          }

        }
        else if (repoType === "owned"){
          let query = input.toLowerCase();
          if (query.length === 0){
            enqueueSnackbar('Please input a search criteria.', {variant: 'failure'})
          }
          else{
            for (let i = 0; i <temp.length; i++){
              console.log(temp[i].tags?.length)
              for (let j = 0; j < temp[i].tags?.length; j++){
                if (temp[i].tags[j].toLowerCase().includes(query)){
                  searchResults.push(temp[i])
                }
              }
            }
            if (searchResults.length !== 0){
              dispatch(setFilteredList(searchResults));
              enqueueSnackbar('Map(s) successfully retrieved!', {variant: 'success'})
            }
            else{
              enqueueSnackbar('No maps found with that tag!', {variant: 'warning'})
            }
          }
        }
        else if (repoType === "shared"){
          let query = input.toLowerCase();
          if (query.length === 0){
            enqueueSnackbar('Please input a search criteria.', {variant: 'failure'})
          }
          else{
            for (let i = 0; i <temp.length; i++){
              for (let j = 0; j < temp[i].tags?.length; j++){
                if (temp[i].tags[j].toLowerCase().includes(query)){
                  searchResults.push(temp[i])
                }
              }
            }
            if (searchResults.length !== 0){
              dispatch(setFilteredList(searchResults));
              enqueueSnackbar('Map(s) successfully retrieved!', {variant: 'success'})
            }
            else{
              enqueueSnackbar('No maps found with that tag!', {variant: 'warning'})
            }
          }
        }
      }
    }
    return (
      <Box>
                <TextField
                  label="Search tags"
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleSubmit}
                />
                {filteredList.length !== 0 && <Button onClick={handleResetView} sx={{color: "white"}}><ClearIcon/></Button>}
              </Box>
    );
    
}